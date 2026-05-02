
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '../components/PageHeader.vue'
import AppFooter from '../components/PageFooter.vue'

const router = useRouter()
const route = useRoute()

const storedUser = localStorage.getItem('user')
const user = ref(storedUser ? JSON.parse(storedUser) : null)

const quiz = ref(null)
const questions = ref([])
const answers = ref({})

const loading = ref(true)
const error = ref('')
const submitted = ref(false)

const score = ref(0)
const total = ref(0)
const lastAttemptId = ref(null)

const examAlreadySubmitted = ref(false)

function isCorrect(value) {
  return value === true || value === 1 || value === 'true'
}
const isMultipleChoice = (question) => {
  // Elle renvoie true si le type est multiple_choice
  return question.question_type === 'multiple_choice';
};

function isExam() {  return quiz.value?.type === 'exam'}
function isPractice() {  return quiz.value?.type === 'practice' || !isExam()}

const isEditing = ref(false);
const newQuestion = ref({
  question_text: '',
  points: 1,
  question_type: 'single_choice', // Valeur par défaut
  options: [
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false }
  ]
});

// Fonction utilitaire pour ajouter une option dans le formulaire
function addOptionField() {
  newQuestion.value.options.push({ option_text: '', is_correct: false });
}

// Fonction utilitaire pour supprimer une option dans le formulaire
function removeOptionField(index) {
  if (newQuestion.value.options.length > 2) {
    newQuestion.value.options.splice(index, 1);
  }
}

async function loadQuiz() {

  console.log("Démarrage du chargement du quiz...");
  loading.value = true;
  error.value = '';


  try {
    const quizId = route.params.id;
    console.log('user.value:', user.value)
    console.log('quizId:', quizId)

    // 1. Charger les métadonnées du Quiz
    const quizResponse = await fetch(`http://localhost:3000/api/quizzes/${quizId}`);
    if (!quizResponse.ok) throw new Error('Impossible de charger les détails du quiz');
    const quizData = await quizResponse.json();
    console.log('quizData:', quizData)
    quiz.value = quizData;


    // 2. Charger les Questions du Quiz
    const questionsResponse = await fetch(`http://localhost:3000/api/questions/quiz/${quizId}`);
    if (!questionsResponse.ok) throw new Error('Impossible de charger les questions');
    const questionsData = await questionsResponse.json();
    console.log('questionsData:', questionsData)

    // 3. Charger les Options pour chaque question
    const loadedQuestions = [];
    for (const question of questionsData) {
      const optsRes = await fetch(`http://localhost:3000/api/question-options/question/${question.question_id}`);
      const optsData = await optsRes.json();
      console.log('options for question', question.question_id, ':', optsData)
      // On attache les options à la question
      loadedQuestions.push({ 
        ...question, 
        options: optsData 
      });
    }

    questions.value = loadedQuestions;
    
    // Initialiser les réponses vides
    if (typeof resetAnswers === 'function') {
      resetAnswers();
    }

    // 4. GESTION DU RÔLE : Charger les scores seulement si c'est un étudiant
    // C'est ici que ça bloquait pour le Teacher auparavant
    if (user.value && user.value.role === 'student') {
      console.log("Rôle étudiant détecté : chargement des tentatives...");
      if (typeof loadLastAttempt === 'function') {
        await loadLastAttempt();
      }
    } else {
      console.log("Rôle Teacher/Admin détecté : skipping loadLastAttempt.");
    }
  } catch (err) {
    console.error("Erreur fatale dans loadQuiz:", err);
    error.value = "Erreur de chargement : " + err.message;
  } finally {
    loading.value = false;
    console.log("Chargement terminé. loading:", loading.value, "error:", error.value);
  }
}

// Creates an empty answer structure depending on the question type.
function resetAnswers() {
  const emptyAnswers = {}

  questions.value.forEach((question) => {
    emptyAnswers[question.question_id] = isMultipleChoice(question) ? [] : null
  })

  answers.value = emptyAnswers
}

// Reloads the student's last attempt and restores their saved answers.
async function loadLastAttempt() {
  const quizId = route.params.id

  const attemptsResponse = await fetch(
    `http://localhost:3000/api/attempts/student/${user.value.user_id}/quiz/${quizId}`,
  )

  const attemptsData = await attemptsResponse.json()

  if (!attemptsResponse.ok) {
    throw new Error(attemptsData.message || attemptsData.error || 'Failed to load attempts')
  }

  if (attemptsData.length === 0) {
    return
  }

  const lastAttempt = attemptsData[0]

  lastAttemptId.value = lastAttempt.attempt_id
  score.value = Number(lastAttempt.score || 0)
  total.value = getTotalPoints()
  submitted.value = true

  if (isExam()) {
    examAlreadySubmitted.value = true
    return
  }

  const answersResponse = await fetch(
    `http://localhost:3000/api/attempt-answers/attempt/${lastAttempt.attempt_id}`,
  )

  const answersData = await answersResponse.json()

  if (!answersResponse.ok) {
    throw new Error(answersData.message || answersData.error || 'Failed to load attempt answers')
  }

  resetAnswers()

  answersData.forEach((answer) => {
    const question = questions.value.find((q) => q.question_id === answer.question_id)

    if (!question) return

    if (isMultipleChoice(question)) {
      answers.value[answer.question_id].push(answer.option_id)
    } else {
      answers.value[answer.question_id] = answer.option_id
    }
  })
}

onMounted(() => {
  loadQuiz()
})
function getTotalPoints() {
  return questions.value.reduce((sum, question) => {
    return sum + Number(question.points || 1)
  }, 0)
}

// Calculates the points earned for one question.
function getQuestionScore(question) {
  const points = Number(question.points || 1)
  const selectedAnswer = answers.value[question.question_id]
  const correctOptions = question.options.filter((option) => isCorrect(option.is_correct))

  if (isMultipleChoice(question)) {
    const selectedIds = selectedAnswer
    const correctIds = correctOptions.map((option) => option.option_id)

    const sameAmount = selectedIds.length === correctIds.length
    const allSelectedAreCorrect = selectedIds.every((id) => correctIds.includes(id))

    return sameAmount && allSelectedAreCorrect ? points : 0
  }

  const selectedOption = question.options.find((option) => option.option_id === selectedAnswer)

  return selectedOption && isCorrect(selectedOption.is_correct) ? points : 0
}

async function saveQuestion() {
  try {
    // 1. Création de la question
    const qRes = await fetch('http://localhost:3000/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quiz_id: route.params.id,
        question_text: newQuestion.value.question_text,
        points: newQuestion.value.points,
        question_type: newQuestion.value.question_type // 'single_choice' ou 'multiple_choice'
      })
    });
    
    const savedQ = await qRes.json();
    const questionId = savedQ.question_id;

    // 2. Création des options
    // On boucle sur ce que tu as tapé dans le formulaire (newQuestion.value.options)
    for (const opt of newQuestion.value.options) {
      if (!opt.option_text) continue; // On ignore les champs vides

      await fetch('http://localhost:3000/api/question-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: questionId,
          text: opt.option_text, // On envoie option_text du JS vers la colonne "text" de SQL
          is_correct: opt.is_correct ? 1 : 0 // SQL préfère 1/0 pour les booléens
        })
      });
    }

    // 3. Rafraîchir les données et vider le formulaire
    await loadQuiz();
    isEditing.value = false;
    
    // Réinitialisation pour la prochaine question
    newQuestion.value = {
      question_text: '',
      points: 1,
      question_type: 'single_choice',
      options: [
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false }
      ]
    };

  } catch (err) {
    console.error("Erreur saveQuestion:", err);
    alert("Erreur lors de l'enregistrement");
  }
}
// Calculates the final score, saves the attempt, and saves the selected answers.
async function submitQuiz() {
  error.value = ''

  if (isExam()) {
    const confirmed = confirm(
      'Are you sure you want to submit this exam? You will not be able to try it again.',
    )

    if (!confirmed) {
      return
    }
  }

  if (isExam() && lastAttemptId.value) {
    error.value = 'You have already submitted this exam.'
    return
  }

  score.value = questions.value.reduce((sum, question) => {
    return sum + getQuestionScore(question)
  }, 0)

  total.value = getTotalPoints()
  submitted.value = true

  try {
    const attemptId = await saveAttempt()

    for (const question of questions.value) {
      await saveQuestionAnswers(attemptId, question)
    }
  } catch (err) {
    error.value = err.message
  }
}

async function saveAttempt() {
  const response = await fetch('http://localhost:3000/api/attempts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      student_id: user.value.user_id,
      quiz_id: quiz.value.quiz_id,
      score: score.value,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Failed to save attempt')
  }

  lastAttemptId.value = data.attempt_id

  return data.attempt_id
}

// Saves all selected answers for one question.
async function saveQuestionAnswers(attemptId, question) {
  const selectedAnswer = answers.value[question.question_id]
  const selectedOptionIds = isMultipleChoice(question) ? selectedAnswer : [selectedAnswer]
  const awardedPoints = getQuestionScore(question)

  for (const optionId of selectedOptionIds) {
    if (!optionId) continue

    const response = await fetch('http://localhost:3000/api/attempt-answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attempt_id: attemptId,
        question_id: question.question_id,
        option_id: optionId,
        is_selected: true,
        awarded_points: awardedPoints,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to save answer')
    }
  }
}

function restartQuiz() {
  resetAnswers()
  submitted.value = false
  score.value = 0
  total.value = 0
  error.value = ''
  lastAttemptId.value = null
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="quiz-page">
    <AppHeader :user="user" />

    <main class="content">
      <button class="back-button" @click="goBack">← Back</button>

      <p v-if="loading" class="message">Loading MCQ...</p>
      <p v-if="error && !loading" class="error-message">
        {{ error }}
      </p>
      <template v-if="!loading && !error">
        <section class="quiz-info">
          <h1>{{ quiz?.title }}</h1>
          <p>{{ quiz?.description || 'No description available.' }}</p>

          <div class="quiz-details">
            <span>Questions: {{ questions.length }}</span>
            <span v-if="quiz?.time_limit_minutes">Time: {{ quiz.time_limit_minutes }} min</span>
            <span v-if="quiz?.max_attempts">Attempts: {{ quiz.max_attempts }}</span>
          </div>
        </section>
        <section v-if="user && user.role === 'teacher'" class="teacher-controls">
          <button @click="isEditing = !isEditing" class="add-btn">
            {{ isEditing ? '✖ Cancel' : '➕ Add New Question' }}
          </button>

          <div v-if="isEditing" class="form-card">
            <h3>Create a New Question</h3>
            
            <!-- Sélecteur de type de question -->
            <div class="form-group">
              <label>Question Type:</label>
              <select v-model="newQuestion.question_type" class="type-select">
                <option value="single_choice">Single Choice (Radio Buttons)</option>
                <option value="multiple_choice">Multiple Choice (Checkboxes)</option>
              </select>
            </div>

            <div class="form-group">
              <label>Question Text:</label>
              <input v-model="newQuestion.question_text" type="text" placeholder="Enter your question here..." />
            </div>

            <div class="options-setup">
              <label>Options (Check all that are correct):</label>
              <div v-for="(opt, index) in newQuestion.options" :key="index" class="option-setup-row">
                <input type="checkbox" v-model="opt.is_correct" />
                <input v-model="opt.option_text" type="text" :placeholder="'Choice ' + (index + 1)" />
                <button v-if="newQuestion.options.length > 2" @click="removeOptionField(index)" class="btn-remove">×</button>
              </div>
              <button @click="addOptionField" class="btn-add-opt">+ Add another option</button>
            </div>

            <div class="form-group" style="margin-top: 10px;">
              <label>Points for this question:</label>
              <input v-model.number="newQuestion.points" type="number" min="1" />
            </div>

            <button @click="saveQuestion" class="save-btn">Save to Database</button>
          </div>
        </section>
        <section v-if="!examAlreadySubmitted" class="questions">
          <h2>Questions</h2>
          <div v-if="questions.length === 0" class="empty-box">
            No questions available for this quiz yet.
          </div>
          <form v-else @submit.prevent="submitQuiz">
            <div
              v-for="(question, index) in questions"
              :key="question.question_id"
              class="question-box"
            >
              <h3>Question {{ index + 1 }}</h3>
              <p class="question-type">
                {{ isMultipleChoice(question) ? 'Multiple answers possible' : 'Single answer' }}
              </p>
              <p class="question-text">
                {{ question.question_text }}
              </p>
              <label
                v-for="option in question.options"
                :key="option.option_id"
                class="option"
                :class="{
                  correct: submitted && isCorrect(option.is_correct),
                  wrong:
                    submitted &&
                    (isMultipleChoice(question)
                      ? answers[question.question_id].includes(option.option_id)
                      : answers[question.question_id] === option.option_id) &&
                    !isCorrect(option.is_correct),
                }"
              >
                <input
                  v-if="isMultipleChoice(question)"
                  v-model="answers[question.question_id]"
                  type="checkbox"
                  :value="option.option_id"
                  :disabled="submitted"
                />
                <input
                  v-else
                  v-model="answers[question.question_id]"
                  type="radio"
                  :name="`question-${question.question_id}`"
                  :value="option.option_id"
                  :disabled="submitted"
                />
                {{ option.text }}
              </label>
            </div>
            <button v-if="!submitted" type="submit" class="submit-button">Submit MCQ</button>
          </form>
          <div v-if="submitted" class="result-box">
            <h2>{{ isExam() ? 'Exam submitted' : 'Saved result' }}</h2>
            <p>{{ score }} / {{ total }}</p>
            <p v-if="isExam()" class="exam-message">
              Your exam has been submitted. You cannot review or retake it.
            </p>
            <button v-if="isPractice()" type="button" class="restart-button" @click="restartQuiz">
              Restart MCQ
            </button>
          </div>
        </section>
      </template>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.exam-message {
  margin: 0.8rem 0 0;
  color: #747789;
  font-size: 0.95rem;
}

.quiz-page {
  min-height: 100vh;
  background: #ffffff;
  color: #02143a;
  font-family: Arial, sans-serif;
}

.content {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.back-button {
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  background: #f0f0f4;
  color: #05051f;
  font-weight: 800;
  cursor: pointer;
}

.back-button:hover {
  opacity: 0.85;
}

.quiz-info {
  padding: 2rem;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(5, 12, 27, 0.05);
}

.quiz-info h1 {
  margin: 0 0 1rem;
  color: #05051f;
  font-size: 2rem;
}

.quiz-info p {
  margin: 0;
  color: #747789;
  line-height: 1.6;
}

.quiz-details {
  margin-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.quiz-details span {
  padding: 0.45rem 0.8rem;
  background: #f7f7fb;
  border-radius: 999px;
  color: #05051f;
  font-size: 0.9rem;
  font-weight: 800;
}

.questions {
  margin-top: 2.5rem;
}

.questions h2 {
  margin: 0 0 1rem;
  color: #05051f;
}

.question-box {
  padding: 1.5rem;
  margin-bottom: 1.2rem;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(5, 12, 27, 0.04);
}

.question-box h3 {
  margin: 0 0 0.4rem;
  color: #05051f;
}

.question-type {
  margin: 0 0 0.8rem;
  color: #747789;
  font-size: 0.9rem;
  font-weight: 800;
}

.question-text {
  margin: 0 0 1rem;
  font-weight: 700;
  color: #02143a;
}

.option {
  padding: 0.8rem 1rem;
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  cursor: pointer;
}

.option:hover {
  background: #f7f7fb;
}

.option.correct {
  background: #dcfce7;
  border-color: #166534;
}

.option.wrong {
  background: #fee2e2;
  border-color: #991b1b;
}

.submit-button {
  width: 100%;
  padding: 0.95rem;
  border: none;
  border-radius: 12px;
  background: #05051f;
  color: white;
  font-weight: 900;
  cursor: pointer;
}

.submit-button:hover {
  opacity: 0.92;
}

.result-box {
  margin-top: 1.5rem;
  padding: 1.5rem;
  text-align: center;
  background: #f7f7fb;
  border-radius: 16px;
}

.result-box h2 {
  margin: 0 0 0.5rem;
  color: #05051f;
}

.result-box p {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 900;
}

.restart-button {
  margin-top: 1rem;
  padding: 0.85rem 1.2rem;
  border: none;
  border-radius: 12px;
  background: #05051f;
  color: white;
  font-weight: 900;
  cursor: pointer;
}

.restart-button:hover {
  opacity: 0.92;
}

.message,
.error-message {
  padding: 1rem;
  border-radius: 12px;
  font-weight: 800;
}

.message {
  background: #f7f7fb;
  color: #05051f;
}

.error-message {
  background: #fee2e2;
  color: #991b1b;
}

@media (max-width: 700px) {
  .content {
    padding: 2rem 1rem;
  }

  .quiz-info h1 {
    font-size: 1.7rem;
  }
}
</style>

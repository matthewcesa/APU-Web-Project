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

function isExam() {
  return quiz.value?.type === 'exam'
}

function isPractice() {
  return quiz.value?.type === 'practice'
}

onMounted(async () => {
  if (!user.value || user.value.role !== 'student') {
    router.push('/login')
    return
  }

  await loadQuiz()
})

function isCorrect(value) {
  return value === true || value === 1 || value === '1'
}

function isMultipleChoice(question) {
  return question.question_type === 'multiple_choice'
}

// Loads the quiz, its questions, their options, and the last saved attempt if it exists.
async function loadQuiz() {
  loading.value = true
  error.value = ''

  try {
    const quizId = route.params.id

    const quizResponse = await fetch(`http://localhost:3000/api/quizzes/${quizId}`)
    const quizData = await quizResponse.json()

    if (!quizResponse.ok) {
      throw new Error(quizData.message || quizData.error || 'Failed to load quiz')
    }

    quiz.value = quizData

    const questionsResponse = await fetch(`http://localhost:3000/api/questions/quiz/${quizId}`)
    const questionsData = await questionsResponse.json()

    if (!questionsResponse.ok) {
      throw new Error(questionsData.message || questionsData.error || 'Failed to load questions')
    }

    const loadedQuestions = []

    for (const question of questionsData) {
      const optionsResponse = await fetch(
        `http://localhost:3000/api/question-options/question/${question.question_id}`,
      )

      const optionsData = await optionsResponse.json()

      if (!optionsResponse.ok) {
        throw new Error(optionsData.message || optionsData.error || 'Failed to load options')
      }

      loadedQuestions.push({
        ...question,
        options: optionsData,
      })
    }

    questions.value = loadedQuestions
    resetAnswers()

    await loadLastAttempt()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
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

      <p v-else-if="error" class="error-message">
        {{ error }}
      </p>

      <template v-else>
        <section class="quiz-info">
          <h1>{{ quiz?.title }}</h1>
          <p>{{ quiz?.description || 'No description available.' }}</p>

          <div class="quiz-details">
            <span>Questions: {{ questions.length }}</span>
            <span v-if="quiz?.time_limit_minutes">Time: {{ quiz.time_limit_minutes }} min</span>
            <span v-if="quiz?.max_attempts">Attempts: {{ quiz.max_attempts }}</span>
          </div>
        </section>

        <section v-if="!examAlreadySubmitted" class="questions">
          <h2>Questions</h2>

          <form @submit.prevent="submitQuiz">
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

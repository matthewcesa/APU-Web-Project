<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'
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

const timeLeft = ref(null)
const timerInterval = ref(null)
const isTimerRunning = ref(false)
const isEditing = ref(false)
const editingQuestionId = ref(null)
const editForm = ref(null)

const newQuestion = ref({
  question_text: '',
  points: 1,
  question_type: 'single_choice',
  options: [
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false }
  ]
})

// --- LOGIQUE CORE ---
function isCorrect(value) { return value === true || value === 1 || value === 'true' }
const isMultipleChoice = (q) => q.question_type === 'multiple_choice'
function isExam() { return quiz.value?.type === 'exam' }
function isPractice() { return quiz.value?.type === 'practice' || !isExam() }

const scoreOutOf20 = computed(() => {
  if (total.value === 0) return "0.00"
  return ((score.value / total.value) * 20).toFixed(2)
})

const formattedTime = computed(() => {
  if (timeLeft.value === null) return "--:--"
  const mins = Math.floor(timeLeft.value / 60)
  const secs = timeLeft.value % 60
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
})

// --- GESTION DU TIMER ---
function startTimer() {
  if (timerInterval.value) stopTimer()
  if (quiz.value?.time_limit_minutes) {
    timeLeft.value = quiz.value.time_limit_minutes * 60
    isTimerRunning.value = true
    timerInterval.value = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        stopTimer()
        autoSubmit()
      }
    }, 1000)
  }
}

function stopTimer() {
  if (timerInterval.value) clearInterval(timerInterval.value)
  timerInterval.value = null
  isTimerRunning.value = false
}

async function autoSubmit() {
  if (submitted.value) return
  alert("Time is up! Your quiz is being submitted automatically.")
  await submitQuiz()
}

// --- CHARGEMENT DES DONNÉES ---
async function loadQuiz() {
  loading.value = true
  error.value = ''
  try {
    const qId = route.params.id
    const qRes = await fetch(`http://localhost:3000/api/quizzes/${qId}`)
    quiz.value = await qRes.json()

    const quesRes = await fetch(`http://localhost:3000/api/questions/quiz/${qId}`)
    const quesData = await quesRes.json()
    
    const loaded = []
    for (const q of quesData) {
      const oRes = await fetch(`http://localhost:3000/api/question-options/question/${q.question_id}`)
      const oData = await oRes.json()
      loaded.push({ ...q, options: oData })
    }
    questions.value = loaded
    resetAnswers()

    if (user.value?.role === 'student') {
      await loadLastAttempt()
      if (!submitted.value) startTimer()
    }
  } catch (err) {
    error.value = "Error loading quiz"
  } finally {
    loading.value = false
  }
}

async function loadLastAttempt() {
  try {
    const res = await fetch(`http://localhost:3000/api/attempts/student/${user.value.user_id}/quiz/${route.params.id}`)
    const data = await res.json()
    if (data && data.length > 0) {
      const last = data[0]
      lastAttemptId.value = last.attempt_id
      score.value = Number(last.score || 0)
      total.value = getTotalPoints()
      submitted.value = true
      if (isExam()) examAlreadySubmitted.value = true
    }
  } catch (e) { console.error(e) }
}

function resetAnswers() {
  const empty = {}
  questions.value.forEach(q => {
    empty[q.question_id] = isMultipleChoice(q) ? [] : null
  })
  answers.value = empty
}

// --- ACTIONS ET SOUMISSION ---
async function submitQuiz() {
  stopTimer()
  score.value = questions.value.reduce((sum, q) => sum + getQuestionScore(q), 0)
  total.value = getTotalPoints()
  submitted.value = true

  try {
    const attemptId = await saveAttempt()
    for (const q of questions.value) {
      if (answers.value[q.question_id]) await saveQuestionAnswers(attemptId, q)
    }
  } catch (err) { error.value = err.message }
}

async function saveAttempt() {
  const res = await fetch('http://localhost:3000/api/attempts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id: user.value.user_id, quiz_id: quiz.value.quiz_id, score: score.value })
  })
  const data = await res.json()
  return data.attempt_id
}

async function saveQuestionAnswers(attemptId, question) {
  const selected = isMultipleChoice(question) ? answers.value[question.question_id] : [answers.value[question.question_id]]
  for (const optionId of selected) {
    if (!optionId) continue
    await fetch('http://localhost:3000/api/attempt-answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attempt_id: attemptId, question_id: question.question_id, option_id: optionId, is_selected: true, awarded_points: getQuestionScore(question) })
    })
  }
}

function restartQuiz() {
  stopTimer()
  resetAnswers()
  submitted.value = false
  score.value = 0
  lastAttemptId.value = null
  startTimer()
}

// --- GESTION PROFESSEUR ---
async function updateQuizSettings() {
  try {
    await fetch(`http://localhost:3000/api/quizzes/${route.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title: quiz.value.title, 
        description: quiz.value.description, 
        time_limit_minutes: quiz.value.time_limit_minutes,
        max_attempts: quiz.value.max_attempts 
      })
    })
    alert("Settings updated!")
  } catch (err) { alert("Error updating settings") }
}

async function saveQuestion() {
  try {
    const qRes = await fetch('http://localhost:3000/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quiz_id: route.params.id, question_text: newQuestion.value.question_text, points: newQuestion.value.points, question_type: newQuestion.value.question_type })
    })
    const saved = await qRes.json()
    for (const opt of newQuestion.value.options) {
      if (opt.option_text) {
        await fetch('http://localhost:3000/api/question-options', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question_id: saved.question_id, text: opt.option_text, is_correct: opt.is_correct ? 1 : 0 })
        })
      }
    }
    await loadQuiz()
    isEditing.value = false
  } catch (e) { alert("Error saving question") }
}

function startEdit(q) {
  editingQuestionId.value = q.question_id
  editForm.value = JSON.parse(JSON.stringify(q))
}

function cancelEdit() { editingQuestionId.value = null }

async function updateQuestion() {
  try {
    await fetch(`http://localhost:3000/api/questions/${editingQuestionId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_text: editForm.value.question_text, points: editForm.value.points, question_type: editForm.value.question_type })
    })
    editingQuestionId.value = null
    await loadQuiz()
  } catch (e) { alert("Error updating question") }
}

// --- HELPERS ---
function getTotalPoints() { return questions.value.reduce((s, q) => s + Number(q.points || 1), 0) }
function getQuestionScore(q) {
  const ans = answers.value[q.question_id]
  if (isMultipleChoice(q)) {
    const correctIds = q.options.filter(o => isCorrect(o.is_correct)).map(o => o.option_id)
    return (ans.length === correctIds.length && ans.every(id => correctIds.includes(id))) ? q.points : 0
  }
  const opt = q.options.find(o => o.option_id === ans)
  return opt && isCorrect(opt.is_correct) ? q.points : 0
}
function goBack() { router.back() }
function addOptionField() { newQuestion.value.options.push({ option_text: '', is_correct: false }) }
function removeOptionField(i) { newQuestion.value.options.splice(i, 1) }

// --- WATCHERS ---
watch(() => newQuestion.value.options, (opts) => {
  const count = opts.filter(o => o.is_correct).length
  newQuestion.value.question_type = count > 1 ? 'multiple_choice' : 'single_choice'
}, { deep: true })

onMounted(loadQuiz)
onUnmounted(stopTimer)
</script>

<template>
  <div class="quiz-page">
    <AppHeader :user="user" />
    <main class="content">
      <button class="back-button" @click="goBack">← Back</button>

      <template v-if="!loading && quiz">
        <!-- HEADER PROF : REGLAGES + BOUTON AJOUT -->
        <section v-if="user?.role === 'teacher'" class="teacher-controls">
          <div class="quiz-settings-panel">
            <h3>⚙️ Quiz Configuration</h3>
            <div class="settings-grid">
              <div class="setting-item">
                <label>Time (min)</label>
                <input type="number" v-model.number="quiz.time_limit_minutes" />
              </div>
              <div class="setting-item">
                <label>Max Attempts</label>
                <input type="number" v-model.number="quiz.max_attempts" />
              </div>
              <button @click="updateQuizSettings" class="btn-save-settings">💾 Save Settings</button>
            </div>
          </div>

          <button @click="isEditing = !isEditing" class="add-btn">
            {{ isEditing ? '✖ Cancel' : '➕ Add New Question' }}
          </button>

          <!-- LE FORMULAIRE QUI MANQUAIT -->
          <div v-if="isEditing" class="form-card">
            <h3>Create a New Question</h3>
            <div class="form-group">
              <label>Question Type:</label>
              <select v-model="newQuestion.question_type" class="type-select">
                <option value="single_choice">Single Choice (Radio)</option>
                <option value="multiple_choice">Multiple Choice (Checkboxes)</option>
              </select>
            </div>

            <div class="form-group">
              <label>Question Text:</label>
              <input v-model="newQuestion.question_text" type="text" placeholder="Enter question..." />
            </div>

            <div class="options-setup">
              <label>Options (Check the correct ones):</label>
              <div v-for="(opt, idx) in newQuestion.options" :key="idx" class="edit-opt-row">
                <input type="checkbox" v-model="opt.is_correct" />
                <input v-model="opt.option_text" :placeholder="'Choice ' + (idx + 1)" />
                <button v-if="newQuestion.options.length > 2" @click="removeOptionField(idx)" type="button" class="btn-remove">×</button>
              </div>
              <button @click="addOptionField" type="button" class="btn-add-opt">+ Add option</button>
            </div>

            <div class="form-group" style="margin-top: 10px;">
              <label>Points:</label>
              <input v-model.number="newQuestion.points" type="number" min="1" />
            </div>

            <button @click="saveQuestion" class="save-btn">Save to Database</button>
          </div>
          <hr class="separator" />
        </section>

        <!-- QUESTIONS & TIMER POUR ETUDIANTS -->
        <section v-if="!examAlreadySubmitted" class="questions">
          <div v-if="timeLeft !== null && !submitted && user.role === 'student'" 
               class="timer-bar" :class="{ 'timer-low': timeLeft < 60 }">
            ⏱️ Remaining: {{ formattedTime }}
          </div>

          <form @submit.prevent="submitQuiz">
            <div v-for="(q, idx) in questions" :key="q.question_id" class="question-box">
              
              <!-- MODE ÉDITION D'UNE QUESTION EXISTANTE -->
              <div v-if="editingQuestionId === q.question_id" class="edit-mode-active">
                <div class="form-group">
                  <label>Edit Question Text:</label>
                  <input v-model="editForm.question_text" class="edit-input-text" />
                </div>
                <div class="edit-options-list">
                  <div v-for="opt in editForm.options" :key="opt.option_id" class="edit-opt-row">
                    <input type="checkbox" v-model="opt.is_correct" />
                    <input v-model="opt.text" />
                  </div>
                </div>
                <div class="edit-actions">
                  <button @click="updateQuestion" type="button" class="btn-save-edit">✅ Save</button>
                  <button @click="cancelEdit" type="button" class="btn-cancel-edit">✖ Cancel</button>
                </div>
              </div>

              <!-- AFFICHAGE NORMAL -->
              <div v-else>
                <div class="question-header">
                  <h3>Question {{ idx + 1 }}</h3>
                  <button v-if="user.role === 'teacher'" @click="startEdit(q)" type="button" class="btn-small-edit">✏️ Edit</button>
                </div>
                <p class="question-text">{{ q.question_text }}</p>
                <div class="options-list">
                  <label v-for="opt in q.options" :key="opt.option_id" class="option" 
                         :class="{ correct: submitted && isCorrect(opt.is_correct) }">
                    <input :type="isMultipleChoice(q) ? 'checkbox' : 'radio'" 
                           v-model="answers[q.question_id]" 
                           :value="opt.option_id" 
                           :disabled="submitted || user.role === 'teacher'" />
                    {{ opt.text }}
                  </label>
                </div>
              </div>
            </div>
            <button v-if="!submitted && user.role === 'student'" type="submit" class="submit-button">Submit MCQ</button>
          </form>

          <div v-if="submitted" class="result-box">
            <div class="final-score">
              <span class="big-score">{{ scoreOutOf20 }} / 20</span>
              <p>{{ score }} / {{ total }} points</p>
            </div>
            <button v-if="!isExam()" @click="restartQuiz" class="restart-button">Try Again</button>
          </div>
        </section>
      </template>
    </main>
    <AppFooter />
  </div>
</template><style scoped>
/* --- MISE EN PAGE GLOBALE --- */
.quiz-page {
  background-color: #f4f7f6;
  min-height: 100vh;
  padding-bottom: 50px;
  font-family: 'Inter', sans-serif;
}

.content {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

/* --- BOUTON RETOUR --- */
.back-button {
  background: none;
  border: none;
  color: #666;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  transition: color 0.3s;
}
.back-button:hover { color: #05051f; }

/* --- TIMER STICKY (Le truc qui flash) --- */
.timer-bar {
  position: sticky;
  top: 20px;
  z-index: 1000;
  background: #05051f;
  color: white;
  padding: 15px 25px;
  border-radius: 50px;
  text-align: center;
  font-weight: 800;
  font-size: 1.2rem;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  margin-bottom: 30px;
  border: 2px solid #3e3e5e;
}

.timer-low {
  background: #e74c3c;
  border-color: #ff7675;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

/* --- PANNEAU PROF (Settings) --- */
.quiz-settings-panel {
  background: white;
  padding: 25px;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  margin-bottom: 30px;
}

.settings-grid {
  display: flex;
  gap: 20px;
  align-items: flex-end;
  margin-bottom: 20px;
}

.setting-item label {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 8px;
  font-weight: 700;
}

.setting-item input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 100px;
  font-weight: bold;
}

/* --- FORMULAIRE D'AJOUT DE QUESTION --- */
.form-card {
  background: #ffffff;
  padding: 30px;
  border-radius: 16px;
  border: 2px solid #05051f;
  margin-bottom: 30px;
}

.edit-opt-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.edit-opt-row input[type="text"] {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

/* --- QUESTIONS --- */
.question-box {
  background: white;
  padding: 25px;
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);
  border: 1px solid #eee;
}

.question-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 15px;
  padding-bottom: 10px;
}

.question-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
}

/* --- OPTIONS --- */
.option {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.option:hover:not(.disabled) {
  background-color: #f8f9ff;
  border-color: #05051f;
}

.option input { margin-right: 15px; transform: scale(1.2); }

/* --- COULEURS DE RESULTATS --- */
.option.correct {
  background-color: #d1f2eb;
  border-color: #1abc9c;
  color: #0e6251;
}

/* --- BOUTONS --- */
.add-btn {
  background: #00b894;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

.submit-button {
  width: 100%;
  padding: 18px;
  background: #05051f;
  color: white;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  margin-top: 20px;
}

.btn-save-settings {
  background: #05051f;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

/* --- BOX DE FIN --- */
.result-box {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 20px;
  margin-top: 30px;
}

.big-score {
  font-size: 4rem;
  font-weight: 900;
  color: #05051f;
}
</style>
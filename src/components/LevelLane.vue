<template>
  <div class="test-lane" id="test">
    <div class="container">
        <div class="test-content">

              <!-- Проверка режима админа -->
          <div v-if="isAdmin && !isEditing">
            <button @click="toggleEditing">Изменить</button>
          </div>

          <!-- Проверка режима админа -->
          <div v-if="isAdmin && isEditing" class="edit-question">
            <h2>Редактирование теста</h2>
            <div v-for="(question, index) in questions" :key="index">
              <label>Вопрос {{ index + 1 }}</label>
              <input class="guestion-input" v-model="question.Question" placeholder="Введите вопрос" />
              <div v-for="(answer, aIndex) in question.answers" :key="aIndex">
                <input v-model="answer.text" placeholder="Ответ" />
                <label>
                  <input type="checkbox" v-model="answer.correct" /> Правильный
                </label>
              </div>
              <button @click="addAnswer(index)">Добавить ответ</button>
              <button class="btn-delete" @click="removeQuestion(index)">Удалить вопрос</button>
            </div>
            <button @click="addQuestion">Добавить вопрос</button>
            <button class="btn-save" @click="saveChanges">Сохранить</button>
            <button class="btn-nope" @click="toggleEditing">Отмена</button>
          </div>

          <div v-if="!isEditing">
            <div class="test-inside" v-if="!isTestComplete">
                    <h1>Проверьте себя!</h1>
                    <h2>{{ currentQuestionIndex + 1 }}: {{ currentQuestion.Question }}</h2>
                    <div class="answers-container">
                        <button                             
                        v-for="(answer, index) in currentQuestion.answers" 
                        :key="index"
                        @click="selectAnswer(index)"
                        :class="{'selected': selectedAnswer === index}">
                        {{ answer.text }}
                        </button>
                    </div>
                    <div class="prev-next">
                        <button @click="prevQuestion" :disabled="currentQuestionIndex === 0">Назад</button>
                        <button @click="nextQuestion" :disabled="selectedAnswer === null">Дальше</button>
                    </div>               
            </div>
          </div>

            <!-- Это модуль тест вывести после того как пройдет весь тест -->
            <div class="test-module" v-if="isTestComplete">   
                <input type="text" placeholder="Имя" v-model="userName">
                <input type="number" placeholder="+7 ZZZ XXX XX XX" v-model="userPhone">
                <button @click="submitResult">Отправить результат</button>
                <!-- <div v-if="showResult" class="final-result">
                    <p>Спасибо, {{ userName }}! Ваш результат: {{ score }} из {{ questions.length }}</p>
                </div> -->

                <div v-if="showAlert" class="alert">
                  <p>Ответ будет отправлен на ваш WhatsApp номер: {{ userPhone }}</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { readData, writeData } from '@/firebase';

export default defineComponent({
    name: 'LevelLane',
    data() {
    return {
      currentQuestionIndex: 0,
      selectedAnswer: null,
      score: 0,
      isTestComplete: false,
      userName: '',
      userPhone: '',
      showResult: false,
      testLine: [],
      isEditing: false
    };
  },
  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin; // Проверка режима админа
    },
    currentQuestion() {
      return this.testLine[this.currentQuestionIndex] || {}; 
    },
    questions() {
      return this.testLine;
    }
  },
  methods: {
    selectAnswer(index) {
      this.selectedAnswer = index;
    },
    nextQuestion() {
      if (this.currentQuestion.answers[this.selectedAnswer].correct) {
        this.score++;
      }
      this.selectedAnswer = null;
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        this.isTestComplete = true;
      }
    },
    prevQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      }
    },
    async submitResult() {
      // Валидация данных
      if (!this.userName || !this.userPhone) {
        alert('Пожалуйста, введите имя и номер телефона.');
        return;
      }

      let currentResults = [];
      try {
        const data = await readData('testResults');
        if (data) {
          currentResults = Object.values(data); // Преобразуем объект данных в массив
        }
      } catch (error) {
        console.error('Ошибка при загрузке текущих результатов:', error);
        alert('Не удалось загрузить текущие результаты. Попробуйте еще раз.');
        return;
      }

      // Отправляем данные в Firebase
      const resultData = {
        name: this.userName,
        phone: this.userPhone,
        score: this.score,
      };

      currentResults.push(resultData);

      try {
        await writeData('testResults', currentResults); // Сохраняем результат в Firebase
        this.showAlert = true; // Показываем уведомление пользователю
      } catch (error) {
        console.error('Ошибка при отправке результата:', error);
        alert('Ошибка при отправке результата. Попробуйте еще раз.');
      }
    },
    toggleEditing() {
      this.isEditing = !this.isEditing; // Переключение между режимами редактирования и просмотра
    },
    addQuestion() {
      this.testLine.push({ Question: '', answers: [{ text: '', correct: false }] });
    },
    addAnswer(questionIndex) {
      this.testLine[questionIndex].answers.push({ text: '', correct: false });
    },
    removeQuestion(index) {
      this.testLine.splice(index, 1);
    },
    async saveChanges() {
      try {
        await writeData('tests', this.testLine); // Сохранение изменений в Firebase
        alert('Изменения сохранены!');
      } catch (error) {
        console.error('Ошибка при сохранении:', error);
      }
    },

    async loadTestQuestions() {
      try {
        const questions = await readData('tests'); // Чтение вопросов из пути 'tests' в Firebase
        if (questions) {
          this.testLine = Object.values(questions); // Преобразование в массив
        }
      } catch (error) {
        console.error('Ошибка при загрузке тестов:', error);
      }
    }
  },
  created() {
    this.loadTestQuestions(); // Загружаем вопросы при создании компонента
  }
})
</script>

<style>
    .test-lane {
        background-color: #FBF3F1;
        width: 100%;
        min-height: 100vh;
    }

    .test-content {
      display: flex;
      justify-content: center;
      padding-top: 150px;
    }

    .test-inside h1 {
      color: #EE1C43;
      margin-bottom: 15px;
    }

    .test-inside {
      max-width: 700px;
    }

    .selected {
      background-color: #ddd;
    }


  .answers-container {
    display: flex;
    flex-direction: column;
  }

  .answers-container button {
    background-color: #FBF3F1;
    border: none;
    margin: 5px;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .answers-container button.selected {
    background-color: #8FBC8F;
    font-size: 18px;
  }

  .answers-container button:hover {
    color: inherit; 
    transform: none; 
  }

  .final-result {
    margin-top: 15px;
  }

  .test-module input {
    margin: 5px;
    padding: 10px;
    border-radius: 5px;
  }

  .test-module button {
    margin-top: 10px;
    margin-left: 10px
  }

  .prev-next button {
    font-size: 1.2rem;
    background-color: #FBF3F1;
    border: none;
    margin: 5px;
  }

  .guestion-input {
    width: 450px;
  }

    .btn-nope {
      background-color: #ee1c43;
    }

    .btn-nope:hover {
      background-color: #b00c26;
      color: white;
    }

    .btn-delete {
      background-color: #ff6347;
      margin-left: 10px;
    }

    .btn-delete:hover {
      background-color: #ff4500;
      color: white;
    }

    .btn-save {
      background-color: #4caf50;
    }

    .btn-save:hover {
      background-color: #276f29;
      color: white;
    }
</style>
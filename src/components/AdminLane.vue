<template>
  <div>
    <div v-if="!isAuthenticated" class="admin-container">
      <h1>Админка</h1>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Пароль" required />
        <button type="submit">Войти</button>
      </form>
    </div>
    <div v-else class="admin-edit">
      <div class="module-admin">
        <h2>Управление контентом</h2>
        <button @click="fetchFormData">Загрузить</button>
        <div v-if="formDataList.length > 0">
          <h3>Данные из формы:</h3>
          <ul>
            <li v-for="(item, index) in formDataList" :key="index">
              Имя: {{ item.name }}, Email: {{ item.email }}, Телефон: {{ item.phone }}
            </li>
          </ul>
        </div>

        <h1>Результаты тестов пользователей</h1>
        <button @click="fetchResults">Загрузить</button>

        <div v-if="testResults.length > 0" class="test-results">
          <div v-for="(result, index) in testResults" :key="index">
            Имя: {{ result.name }}, Телефон: {{ result.phone }}, Балл: {{ result.score }} из
            {{ totalQuestions }}
          </div>
        </div>
        <button class="btn-out" @click="logout">Выйти</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { readData } from '@/firebase';

export default defineComponent({
  setup() {
    const store = useStore();
    const email = ref('');
    const password = ref('');
    const formDataList = ref<any[]>([]);
    const testResults = ref<any[]>([]);

    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const isAdmin = computed(() => store.getters['price/isAdmin']);
    const totalQuestions = 10;

    const login = () => {
      const trimmedEmail = email.value.trim(); // Удаляем пробелы
      // Проверка формата email
      if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
        alert('Введите корректный email адрес');
        return;
      }

      store
        .dispatch('login', { email: trimmedEmail, password: password.value })
        .then(() => {
          console.log('Вход успешен');
          if (trimmedEmail === 'admin@example.com') {
            store.dispatch('price/setAdmin', true); // Установка статуса администратора
          } else {
            store.dispatch('price/setAdmin', false); // Установка статуса для обычного пользователя
          }
        })
        .catch((error: Error) => {
          alert(error.message);
        });
    };

    const logout = () => {
      store.dispatch('logout');
      email.value = '';
      password.value = '';
    };

    const fetchFormData = async () => {
      try {
        const data = await readData('forms'); // Получаем данные из Firebase
        if (data) {
          formDataList.value = Object.values(data); // Преобразуем объект данных в массив
        }
      } catch (error: any) {
        console.error('Ошибка при получении данных:', error);
        alert('Не удалось загрузить данные');
      }
    };

    const fetchResults = async () => {
      try {
        const data = await readData('testResults');
        if (data) {
          console.log('Полученные данные:', data);
          testResults.value = Object.values(data);
        }
      } catch (error: any) {
        console.error('Ошибка при получении данных:', error);
        alert('Не удалось загрузить результаты тестов');
      }
    };

    return {
      email,
      password,
      isAuthenticated,
      isAdmin,
      login,
      logout,
      fetchFormData,
      fetchResults,
      formDataList,
      testResults,
      totalQuestions,
    };
  },
});
</script>

<style scoped>
.admin-container {
  max-width: 600px;
  margin: auto;
  padding: 200px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.admin-edit {
  max-width: 1100px;
  margin: auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.module-admin {
  max-width: 1100px;
  min-height: 100vh;
  margin: auto;
  padding: 200px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

h1,
h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

input {
  margin: 10px 0;
  padding: 15px;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #28a745;
  outline: none;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background: #f9f9f9;
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.test-results {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid rgb(221, 32, 32);
  border-radius: 8px;
  background-color: #fbf3f1;
}

.test-results div {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
}

.btn-out {
  padding: 5px 20px;
  background-color: #ee1c43;
}

.btn-out:hover {
  background-color: #b00c26;
  color: white;
}

@media (max-width: 768px) {
  .admin-container {
    padding: 130px;
    max-width: 90%;
    height: 100vh;
  }

  .admin-edit,
  .module-admin {
    padding: 60px;
    max-width: 90%;
  }

  h1,
  h2 {
    font-size: 1.5em;
    margin-bottom: 15px;
  }

  input {
    padding: 8px;
    font-size: 14px;
  }

  .btn-out {
    padding: 8px 16px;
  }

  .test-results {
    padding: 10px;
  }

  .test-results div {
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .admin-container,
  .admin-edit,
  .module-admin {
    padding: 20px;
    max-width: 100%;
  }

  h1,
  h2 {
    font-size: 1.2em;
    margin-bottom: 10px;
  }

  input {
    padding: 6px;
    font-size: 12px;
  }

  .btn-out {
    padding: 6px 12px;
  }

  .test-results {
    padding: 8px;
  }

  .test-results div {
    padding: 6px;
  }
}
</style>

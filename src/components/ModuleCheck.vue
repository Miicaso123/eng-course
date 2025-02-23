<template>
  <div class="modal-overlay">
    <div class="module">
      <div class="module-close" @click="$emit('close')">
        <font-awesome-icon :icon="['fas', 'times']" @click="toggleMenu" />
      </div>
      <form @submit.prevent="submitForm">
        <input type="text" v-model="formData.name" placeholder="Ваше имя: " />
        <input type="email" v-model="formData.email" placeholder="Ваш e-mail: " />
        <input type="number" v-model="formData.phone" placeholder="Телефон номер: " />
        <button type="submit">Отправить</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { writeData } from '@/firebase';

export default defineComponent({
  name: 'ModuleCheck',
  setup() {
    const formData = ref({
      name: '',
      email: '',
      phone: '',
    });

    const errorMessage = ref('');

    const submitForm = async () => {
      if (!formData.value.name || !formData.value.email || !formData.value.phone) {
        errorMessage.value = 'Все поля должны быть заполнены!';
        return;
      }

      errorMessage.value = '';

      try {
        // Запись данных в Firebase
        await writeData('forms/' + formData.value.name, formData.value);

        alert('Данные успешно отправлены!');

        // Очищаем форму после успешной отправки
        formData.value.name = '';
        formData.value.email = '';
        formData.value.phone = '';
      } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при отправке данных');
      }
    };

    return {
      formData,
      submitForm,
      errorMessage,
    };
  },
});
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.module {
  width: 500px;
  height: 400px;
  background-color: #fbf3f1;
  border: 1px solid red;
  margin: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Окно должно быть выше фоновой подложки */
  position: relative;
}

form input {
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

form button {
  margin-left: 142px;
  margin-top: 30px;
}

.module-close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 24px;
}

.error-message {
  color: red;
  margin-top: 15px;
}
</style>

<template>
  <div class="contacs-lane" id="contacs">
    <div class="conatiner">
      <div class="contacs-content">
        <div class="contacs-inside">
          <div class="contacs-adress">
            <h1>Контакты</h1>
            <br />
            <div class="contacs-phone">
              <p>{{ contacts.phone }}</p>
              <p>{{ contacts.address }}</p>
            </div>
            <br />
            <div class="contacs-social">
              <a :href="contacts.insta" target="_blank" rel="noopener noreferrer">
                <img src="@/assets/insta.png" alt="instagram" />
              </a>
              <a :href="contacts.whatsapp" target="_blank" rel="noopener noreferrer">
                <img src="@/assets/whatsapp.png" alt="whatsapp" />
              </a>
            </div>
          </div>
          <div class="contacs-carta">
            <img src="@/assets/carta.png" alt="carta" />
          </div>
        </div>

        <div v-if="isAdmin" class="edit-fields">
          <h2>Редактировать контакты</h2>
          <input
            v-model="contacts.phone"
            type="text"
            placeholder="Введите номер телефона"
            class="edit-input"
          />
          <input
            v-model="contacts.address"
            type="text"
            placeholder="Введите адрес"
            class="edit-input"
          />
          <input
            v-model="contacts.insta"
            type="text"
            placeholder="Введите ссылку на Instagram"
            class="edit-input"
          />
          <input
            v-model="contacts.whatsapp"
            type="text"
            placeholder="Введите ссылку на WhatsApp"
            class="edit-input"
          />
          <button @click="updateContacts" class="save-button">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { fetchContacts, writeData } from '@/firebase';

interface Contact {
  phone: string;
  address: string;
  insta: string;
  whatsapp: string;
}

export default defineComponent({
  setup() {
    const store = useStore();
    const contacts = ref({ phone: '', address: '', insta: '', whatsapp: '' });
    const isAdmin = computed(() => store.getters.isAdmin);

    onMounted(async () => {
      try {
        const contactData = await fetchContacts();
        if (contactData) {
          contacts.value = contactData;
        }
      } catch (error) {
        console.error('Ошибка при загрузке контактов:', error);
      }
    });

    const updateContacts = async () => {
      try {
        await writeData('contacs', contacts.value);
      } catch (error) {
        console.error('Ошибка при обновлении контактов:', error);
      }
    };

    return { contacts, updateContacts, isAdmin };
  },
});
</script>

<style>
.contacs-lane {
  background-color: #fbf3f1;
  width: 100%;
}

.contacs-content {
  display: flex;
  flex-direction: column;
  margin: auto;
  padding-top: 110px;
}

.contacs-inside {
  display: flex;
  margin: auto;
  align-items: center;
  gap: 50px;
  margin-bottom: 100px;
}

.contacs-adress h1 {
  color: #ee1c43;
}

.contacs-adress p {
  font-size: 1.3rem;
}

.contacs-adress {
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contacs-social {
  display: flex;
  gap: 15px;
}

.contacs-carta img {
  width: 650px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.edit-fields {
  margin: 50px auto 60px;
  display: block;
  text-align: center;
}

.edit-input {
  display: block;
  margin-bottom: 10px;
  padding: 8px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.save-button {
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #45a049;
}

@media (max-width: 760px) {
  .contacs-content {
    width: 85%;
    display: flex;
    margin: auto;
  }

  .contacs-inside {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 50px;
  }

  .contacs-carta img {
    width: 400px;
  }
}
</style>

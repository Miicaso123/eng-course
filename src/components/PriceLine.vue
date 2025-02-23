<template>
  <div class="price-lane" id="price">
    <div class="container">
      <div class="price-content">
        <div class="price-inside">
          <div class="price-title">
            <h2>Прайс Лист</h2>
          </div>

          <div v-for="(pricen, index) in namePrices" :key="index" class="price-item">
            <div class="price-name">
              <p>{{ pricen.name }}:</p>
              <h4>{{ pricen.price }}</h4>
            </div>

            <!-- Поле редактирования цены для всех пользователей -->

            <input
              v-if="isAdmin"
              v-model="pricen.price"
              @blur="updatePrice(index, pricen.price)"
              type="text"
              placeholder="Введите цену"
              class="edit-price-input"
            />

            <button v-if="isAdmin" @click="deletePrice(index)" class="delete-button">
              Удалить
            </button>
          </div>

          <!-- Форма добавления новой цены для всех пользователей -->

          <div v-if="isAdmin" class="add-price">
            <h3>Добавить новую цену</h3>
            <input v-model="newName" placeholder="Название" class="input-name" />
            <input v-model="newPrice" placeholder="Цена" class="input-price" />
            <button @click="addPrice" class="add-button">Добавить</button>
          </div>

          <button v-if="isAdmin" @click="savePrices" class="save-button">
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { PriceItem } from '../store/modules/priceModule';
import { fetchPrices, writeData, deleteData } from '@/firebase';

export default defineComponent({
  setup() {
    const store = useStore();

    const isAdmin = computed(() => store.getters.isAdmin);

    const namePrices = ref<PriceItem[]>([]);
    const newName = ref('');
    const newPrice = ref('');

    const loadPrices = async () => {
      const data = await fetchPrices(); // Получить данные
      if (data) {
        namePrices.value = data; // Присвоить данные
      }
    };

    const savePrices = async () => {
      const updatedPricesObj: { [key: number]: { price: string; name: string } } = {};
      namePrices.value.forEach((pricen, index) => {
        updatedPricesObj[index] = { price: pricen.price, name: pricen.name };
      });

      // Сохранить все обновленные цены в Firebase
      try {
        await writeData('prices/namePrices', updatedPricesObj);
        console.log('Изменения успешно сохранены.');
      } catch (error) {
        console.error('Ошибка при записи обновленных цен:', error);
      }
    };

    const updatePrice = async (index: number, price: string) => {
      if (isAdmin.value) {
        // Проверка на права администратора
        store.dispatch('price/updatePriceAction', { index, price });
      }
    };

    const addPrice = async () => {
      // Проверка на заполненность полей
      if (!newName.value || !newPrice.value) {
        console.error('Название и цена не должны быть пустыми!');
        return; // Прерываем выполнение, если поля пустые
      }

      const newPriceItem = { name: newName.value, price: newPrice.value };

      if (isAdmin.value) {
        // Проверка на права администратора
        await store.dispatch('price/addPriceAction', newPriceItem);
        newName.value = '';
        newPrice.value = '';
        await loadPrices(); // Перезагружаем данные после добавления новой цены
      }
    };

    const deletePrice = async (index: number) => {
      if (isAdmin.value) {
        // Проверка на права администратора
        namePrices.value.splice(index, 1); // Удаляем элемент из массива
        await writeData('prices/namePrices', namePrices.value);
        await savePrices();
      }
    };

    onMounted(() => {
      loadPrices();
    });

    return {
      namePrices,
      newName,
      newPrice,
      updatePrice,
      addPrice,
      savePrices,
      deletePrice,
      isAdmin,
    };
  },
});
</script>

<style scoped>
.price-lane {
  background-color: #8fbc8f;
  width: 100%;
  padding-top: 80px;
  padding-bottom: 40px;
}

.price-title h2 {
  font-size: 2.4rem;
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 3px solid #ee1c43;
  display: inline-block;
  padding-bottom: 10px;
}

.price-content {
  display: flex;
  /* margin: auto; */
  justify-content: center;
  flex-direction: column;
}

.price-inside {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 15px;
  background-color: #fbf3f1;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.price-name p {
  font-size: 1.6rem;
}

.price-name h4 {
  font-size: 1.6rem;
  color: #ee1c43;
}

input.edit-price-input {
  padding: 10px;
  font-size: 1rem;
  border: 2px solid #ee1c43;
  border-radius: 5px;
  width: 100%;
  max-width: 150px;
  outline: none;
}

input:focus {
  border-color: #8fbc8f;
}

.add-price {
  margin-top: 30px;
  text-align: center;
}

input.input-name,
input.input-price {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  margin: 10px 0;
  border: 2px solid #ee1c43;
  border-radius: 5px;
  font-size: 1rem;
}

input.input-name:focus,
input.input-price:focus {
  border-color: #8fbc8f;
}

button {
  padding: 5px 20px;
  background-color: #ee1c43;
  color: white;
  width: 162px;
  height: 52px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #b00c26;
}

button.delete-button {
  background-color: #ff6347;
  margin-left: 10px;
}

button.delete-button:hover {
  background-color: #ff4500;
}

button.save-button {
  margin-top: 20px;
  background-color: #4caf50;
}

button.save-button:hover {
  margin-top: 20px;
  background-color: #276f29;
}

@media (max-width: 760px) {
  .price-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .price-name {
    margin-bottom: 10px;
  }

  input.edit-price-input {
    max-width: 100%;
  }
}
</style>

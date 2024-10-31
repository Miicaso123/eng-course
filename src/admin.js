import { writeData, readData } from './firebase';

export async function updatePrice(id, newPrice) {
    try {
      // Получаем данные из Firebase
      const data = await readData('/state');
      
      // Находим нужную запись по id и обновляем цену
      const priceItem = data.namePrices.find(item => item.id === id);
      if (priceItem) {
        priceItem.price = newPrice;
  
        // Обновляем данные в Firebase
        await writeData('/state', data);
        console.log("Цена успешно обновлена в Firebase!");
  
      } else {
        console.error("Цена с указанным id не найдена");
      }
    } catch (error) {
      console.error("Ошибка при обновлении цены: ", error);
    }
  }
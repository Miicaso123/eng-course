import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, update, onValue, remove, push } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDk1hTiM7BiO2KgaD2rUB3DtstGbzd9k50',
  authDomain: 'aikoproject-daea4.firebaseapp.com',
  databaseURL: 'https://aikoproject-daea4-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: 'aikoproject-daea4',
  storageBucket: 'aikoproject-daea4.appspot.com',
  messagingSenderId: '969240110583',
  appId: '1:969240110583:web:043a51f323244a63a83af2',
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };

export const fetchPrices = async () => {
  const dbRef = ref(database, 'prices/namePrices');
  const snapshot = await get(dbRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.values(data);
  } else {
    console.error('No data available');
    return []; // Возвращаем пустой массив, если данных нет
  }
};

export const fetchContacts = async () => {
  const contactsRef = ref(database, 'contacs'); // Указываем путь в Realtime Database
  try {
    const snapshot = await get(contactsRef); // Получаем данные
    if (snapshot.exists()) {
      return snapshot.val(); // Возвращаем данные контактов
    } else {
      console.error('Контакты не найдены.');
      return null; // Возвращаем null, если данных нет
    }
  } catch (error) {
    console.error('Ошибка при получении контактов:', error);
    throw error; // Выбрасываем ошибку
  }
};

export async function readData(path) {
  const snapshot = await get(ref(database, path));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    throw new Error('Нет данных по указанному пути');
  }
}

export const writeData = async (path, data) => {
  const db = getDatabase();
  try {
    await set(ref(db, path), data); // Записываем данные по указанному пути
    console.log('Данные успешно записаны:', data);
  } catch (error) {
    console.error('Ошибка при записи данных: ', error);
  }
};

export async function deleteData(path) {
  try {
    await remove(ref(database, path));
    console.log('Данные успешно удалены!');
  } catch (error) {
    console.error('Ошибка при удалении данных: ', error);
  }
}

// export const addTestQuestions = async () => {
//   const tests = [
//     {
//       Question: "There ____ a lot of people outside the building. What`s the problem?",
//       answers: [
//         { text: "are", correct: false },
//         { text: "is", correct: true },
//         { text: "be", correct: false },
//         { text: "am", correct: false }
//       ]
//     },
//     {
//       Question: "Did you ____ shopping after work yesterday?",
//       answers: [
//         { text: "went", correct: false },
//         { text: "goes", correct: false },
//         { text: "going", correct: false },
//         { text: "go", correct: true }
//       ]
//     },
//     {
//       Question: "The beach was very crowded ____ Monday",
//       answers: [
//         { text: "in", correct: false },
//         { text: "on", correct: true },
//         { text: "out", correct: false },
//         { text: "to", correct: false }
//       ]
//     }
//   ];

//   try {
//     // Записываем данные в путь "testLine"
//     await set(ref(database, 'tests'), tests);
//     console.log('Тестовые вопросы успешно добавлены в Realtime Database!');
//   } catch (error) {
//     console.error('Ошибка при добавлении тестовых вопросов: ', error);
//   }
// };

// addTestQuestions();

import { writeData } from './firebase';
import fs from 'fs';

// Данные, которые нужно отправить
const state = {
  namePrices: [
    { id: 1, name: 'Групповые занятия по 60 минут, 2 раза в неделю', price: '20 900 тенге' },
    { id: 2, name: 'Групповые занятия по 60 минут, 3 раза в неделю', price: '25 900 тенге' },
    { id: 3, name: 'Групповые занятия по 90 минут, 2 раза в неделю', price: '26 900 тенге' },
    { id: 4, name: 'Групповые занятия по 90 минут, 3 раза в неделю', price: '32 900 тенге' },
    { id: 5, name: 'Индивидуальные занятия по 60 минут, 2 раза в неделю', price: '36 900 тенге' },
    { id: 6, name: 'Индивидуальные занятия по 90 минут, 2 раза в неделю', price: '39 900 тенге' },
  ],
  testLine: [
    {
      Question: 'There ____ a lot of people outside the building. What`s the problem?',
      answers: [
        { text: 'are', correct: false },
        { text: 'is', correct: true },
        { text: 'be', correct: false },
        { text: 'am', correct: false },
      ],
    },
    {
      Question: 'Did you ____ shopping after work yesterday?',
      answers: [
        { text: 'went', correct: false },
        { text: 'goes', correct: false },
        { text: 'going', correct: false },
        { text: 'go', correct: true },
      ],
    },
    {
      Question: 'The beach was very crowded ____ Monday',
      answers: [
        { text: 'in', correct: false },
        { text: 'on', correct: true },
        { text: 'out', correct: false },
        { text: 'to', correct: false },
      ],
    },
  ],
  isAuthenticated: false,
  isAdmin: false,
};

// Запись данных в Firebase
writeData('/state', state)
  .then(() => {
    console.log('Данные успешно записаны в Firebase!');
  })
  .catch((error) => {
    console.error('Ошибка при записи в Firebase: ', error);
  });

// Запись данных в db.json
fs.writeFileSync('db.json', JSON.stringify(state, null, 2), 'utf-8');
console.log('Данные успешно записаны в db.json!');

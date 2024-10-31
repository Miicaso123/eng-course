const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

// Middleware для обработки JSON
app.use(express.json());

// Эмуляция базы данных (сохранение данных в db.json)
app.post('/api/form', (req, res) => {
  const newData = req.body;
  
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) throw err;
    
    const jsonData = JSON.parse(data);
    jsonData.formSubmissions.push(newData);
    
    fs.writeFile('db.json', JSON.stringify(jsonData), 'utf8', (err) => {
      if (err) throw err;
      res.status(200).send('Данные успешно сохранены');
    });
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
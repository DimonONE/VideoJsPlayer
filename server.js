const express = require('express');

const app = express();
const port = 3000;

// Оголошуємо статичну папку для обслуговування статичних файлів
app.use(express.static('src'));

// Оголошуємо маршрут для основної сторінки
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/public/index.html');
});

// Слухаємо на зазначеному порті
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
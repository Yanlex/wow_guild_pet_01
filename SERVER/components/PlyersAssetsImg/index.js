const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../db/guild.db');
const imageFolderpatch = path.resolve(__dirname, '../../assets/img');


const db = new sqlite3.Database(dbPath);

// Указывает на папку, где будут храниться изображения пользователей на сервере
const imageFolder = imageFolderpatch


// Создает папку, если она не существует
if (!fs.existsSync(imageFolder)) {
  fs.mkdirSync(imageFolder);
}


// Запрашивает значения столбца character_name из таблицы members
db.all('SELECT character_name, thumbnail_url FROM members', [], (error, rows) => {
  if (error) {
    console.log(error);
  }

  rows.forEach((row, index) => {
    // Добавляет задержку перед каждым запросом, чтобы не перегружать сервер
    setTimeout(() => {
      const imageUrl = row.thumbnail_url;
      const fileName = row.character_name + '.jpg';
      const imagePath = path.join(imageFolder, fileName);

      // Проверяет существование файла
      if (fs.existsSync(imagePath)) {
        console.log('Файл уже существует:', imagePath);
        return; // Прерывает выполнение текущей итерации цикла и переходит к следующей строке
      }

      // // Проверяет существование файла
      // if (fs.existsSync(imagePath)) {
      //   // Удаляет существующий файл
      //   fs.unlinkSync(imagePath);
      // }


      // Выполняет запрос на получение изображения по URL-адресу
      fetch(imageUrl)
        .then(response => response.buffer())
        .then(buffer => {
          // Сохраняет изображение в папку на сервере
          fs.writeFile(imagePath, buffer, () => {
            console.log('Изображение сохранено:', imagePath);
          });
        })
        .catch(error => {
          console.log('Ошибка при получении изображения:', error);
        });
    }, index * 100); // Устанавливает задержку между запросами в 500 миллисекунд
  });
});

// Закрывает подключение к базе данных
db.close();
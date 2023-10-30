const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const path = require('path');
const config = require('../webpack.config.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const compiler = webpack(config);
require('dotenv').config()
const cookieParser = require('cookie-parser')
secretKey = process.env.JWT_SECRET

const guildData = require('./db/components/fetchGuild/fetchGuild.js');

// работа с БД
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.resolve(__dirname, './db/guild.db');
const db = new sqlite3.Database(dbPath);


// REDIS
const redis = require("redis");

let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

//

app.use(bodyParser.json({ limit: '10mb' }));

app.use(cors());
app.use(cookieParser())

app.use(express.urlencoded({ extended: true }));

// Фронт
app.use(express.static(path.join(__dirname, '../dist')));

app.post("/ttt", (req, res) => {
  const { key, value } = req.body
  redisClient.set('key', 'value', function (err, reply) {
    if (err) {
      console.error(err);
    } else {
      console.log('Value set in Redis');
    }
  });
  res.json('OK')
})

// Устанавливаем путь к папке, содержащей изображения аватарок игровых персонажей
app.use('/avatar', express.static(path.join(__dirname, './assets/img')));
// Endpoint для отдачи изображений

// Регистрация юзера в БД
const registerUser = require('./components/Registation/index.js');
app.post('/register', (req, res) => {
  registerUser(req, res);
});

// Апи к БД
app.use('/createrowdb/:name/:type', require('./db/components/CreateOrUpdateBD/createRowDb.js'));
app.use('/removerowdb/:name', require('./db/components/CreateOrUpdateBD/removeRowDb.js'));
app.get('/update-mplus-score', require('./db/components/MythicPlusCreateOrUpdate/updateMPlusScore.js'));

// Авторизация
app.use('/login', require('./components/Login/index.js'));

app.post('/auth', require('./db/components/Authorization/index.js'))


// Вывод всех строк из таблицы members
app.get('/guild-data', async (req, res) => {
  // Выполняем SQL-запрос к базе данных
  db.all('SELECT * FROM members', (err, rows) => {
    if (err) {
      // Обработка ошибок, если таковые возникнут
      console.error(err.message);
      res.status(500).send('Ошибка сервера');
    } else {
      // Возвращаем данные из базы данных в формате JSON
      res.json(rows);
      console.log('Данные гильдии получены')
    }
  });
});

// Вывод одного игрока, делает запрос к api raider io
app.get('/member/:name', async (req, res) => {
  const name = req.params.name
  const data = await guildData.getPlayerMythicPlus(name)
  res.send(data)
})

// Webpack dev middleware
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

// Route for serving the index file
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../dist', '../dist/index.html'));

  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies.sesionUuid)
  console.log('Hello')
  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)

});

app.get('/profile', (req, res) => {
  const jwt = req.cookies.JWT;
  const sessionid = req.cookies.SessionID;
  res.send('Hi')
  // Использование значения куки "user"
  console.log(`Welcome, ${jwt} : ${sessionid} !`);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Server listening on port ${port}`);
});

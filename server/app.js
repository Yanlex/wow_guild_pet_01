const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cron = require('node-cron');
const cookieSecret = process.env.COOKIE_SECRET;

const sqlite3 = require('sqlite3').verbose();

// работа с БД
const dbPath = path.resolve(__dirname, './db/guild.db');
const db = new sqlite3.Database(dbPath);

// REDIS ../webpack.config.js
const redis = require('redis');
const config = require('../webpack.config');
const registerUser = require('./components/Registation/index');
const loginR = require('./components/Login/index');
const checkExistUser = require('./components/Login/checkExistUser');
const session = require('./components/Login/session');
const checkPlayerGuild = require('./db/components/GuildDB/PlayerGuild/index');
const updateGuildMemberList = require('./db/components/GuildDB/GuildMembers/index');
const mythic_plus_score_dfs3 = require('./db/components/GuildDB/MythicPlusScoreUpdate/scoreUpdate');
const { getPlayerMythicPlus } = require('./db/components/GuildDB/fetchGuild');
// checkPlayerGuild

cron.schedule('* 06 * * *', checkPlayerGuild, {
	scheduled: true,
	timezone: 'Europe/Moscow',
});

// Обновляет данные гильдии ( саму гильдию и мемберов )
cron.schedule('* 02 * * *', updateGuildMemberList, {
	scheduled: true,
	timezone: 'Europe/Moscow',
});

cron.schedule('* 04 * * *', mythic_plus_score_dfs3, {
	scheduled: true,
	timezone: 'Europe/Moscow',
});

const compiler = webpack(config);

let redisClient;

(async () => {
	redisClient = redis.createClient();

	redisClient.on('error', (error) => console.error(`Error : ${error}`));

	await redisClient.connect();
})();

// *** APP USE *** ///
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors({ credentials: true }));
app.use(cookieParser(cookieSecret));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
// Фронт
app.use(express.static(path.join(__dirname, '../dist')));
// Устанавливаем путь к папке, содержащей изображения аватарок игровых персонажей
app.use('/img', express.static(path.join(__dirname, './assets/img')));
// Устанавливаем путь к папке, содержащей изображения аватарок игровых персонажей
app.use('/avatar', express.static(path.join(__dirname, './assets/avatars')));
// Устанавливаем путь к папке, содержащей классовых изображения
app.use('/class', express.static(path.join(__dirname, './assets/class')));
// Устанавливаем путь к папке, содержащей изображения аватарок игровых персонажей
app.use('/video', express.static(path.join(__dirname, './assets/video')));
// Апи к БД
// app.use('/createrowdb/:name/:type', require('./db/components/CreateOrUpdateBD/createRowDb'));
// app.use('/removerowdb/:name', require('./db/components/CreateOrUpdateBD/removeRowDb'));
// app.get('/update-mplus-score', require('./db/components/GuildDB/MythicPlusCreateOrUpdate/updateMPlusScore.js'));
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Что-то пошло не так');
});
// Webpack dev middleware
app.use(
	webpackDevMiddleware(compiler, {
		publicPath: config.output.publicPath,
	}),
);
// --- APP USE --- ///

app.post('/register', (req, res) => {
	registerUser(req, res);
});

app.get('/clear-cookie', (request, response) => {
	const options = {
		maxAge: 1704085200, // would expire after 15 minutes
		httpOnly: true, // The cookie only accessible by the web server
		signed: true, // Indicates if the cookie should be signed
	};
	response.clearCookie('User', options);
	response.clearCookie('SessionID', options);
	response.end(); // Отправка ответа
});

// Обработчик авторизации пользователя
app.post('/login', checkExistUser, session, async (req, res, next) => {
	try {
		await loginR(req, res);
	} catch (err) {
		next(err);
	}
});

// app.get('/auth', require('./db/components/AuthDB/Authorization/index.js'));

// проверка авторизации в редисе
app.get('/redis', async (req, res) => {
	try {
		const userData = await redisClient.hGetAll(req.signedCookies.User);
		if (userData.sesionUuid === req.signedCookies.SessionID) {
			res.json(true);
		} else {
			res.send(false);
		}
	} catch {
		console.log('ERROR');
		res.send(false);
	}
});

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
			console.log('Данные гильдии получены');
		}
	});
});

// Вывод одного игрока, делает запрос к api raider io
app.get('/member/:name', async (req, res) => {
	const { name } = req.params;
	const data = await getPlayerMythicPlus(name);
	res.send(data);
});

// Route for serving the index file
// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, '../dist', '../dist/index.html'));
// });
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, '../dist', '../dist/index.html'), (err) => {
		if (err) {
			res.status(500).send(err);
		}
	});
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

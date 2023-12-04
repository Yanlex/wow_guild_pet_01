const redis = require('redis');
const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

let redisClient;
(async () => {
	redisClient = redis.createClient();

	redisClient.on('error', (error) => console.error(`Error : ${error}`));

	await redisClient.connect();
})();

async function session(req, res, next) {
	const userName = res.locals.name;
	const userRole = res.locals.role;
	const userToken = res.locals.token;

	let options = {
		maxAge: 31536000, // would expire after 15 minutes
		httpOnly: true, // The cookie only accessible by the web server
		signed: true, // Indicates if the cookie should be signed
	};

	console.log('Вошел в session');
	try {
		const userSession = await redisClient.hGetAll(userName);
		// Если сессия пользователя есть в редисе отправляем ему информацию из редиса
		if (Object.keys(userSession).length > 0 && userSession.sesionUuid) {
			res
				.cookie('SessionID', userSession.sesionUuid, options)
				.cookie('User', userName, options)
				.status(200)
				.json({ message: 'Вы успешно авторизированы' });
		} else {
			// Если пользователя нету в редисе тогда вносим его
			const sesionUuid = `session_${uuidv4()}`;
			res
				.cookie('SessionID', sesionUuid, options)
				.cookie('User', userName, options)
				.status(200)
				.json({ message: 'Вы успешно авторизированы' });
			await redisClient.hSet(
				userName,
				{
					sesionUuid,
					userRole,
					userToken,
				},
				(err, reply) => {
					if (err) {
						console.error(err);
					} else {
						console.log('Role set in Redis');
					}
				},
			);
		}
	} catch (e) {
		console.error(e);
	} finally {
		console.log('Вышел из session');
		next();
	}
}

module.exports = session;

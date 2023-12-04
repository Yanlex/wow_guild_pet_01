const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const redis = require('redis');
const userdb = path.resolve(__dirname, '../../db/users.db');
const { v4: uuidv4 } = require('uuid');

/// Подключаем редис
let redisClient;
(async () => {
	redisClient = redis.createClient();

	redisClient.on('error', (error) => console.error(`Error : ${error}`));

	await redisClient.connect();
})();

async function loginR(req, res) {
	console.log(`Зашел в loginR`);
	try {
		const { name, password } = req.body;
		const role = res.locals.role;
		const username = name;
	} catch (error) {
		res.status(500).json({ error: 'Что-то пошло не так' });
	} finally {
		console.log('Вышел из loginR');
	}
}

module.exports = loginR;

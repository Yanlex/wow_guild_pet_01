const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const userdb = path.resolve(__dirname, '../../db/users.db');
require('dotenv').config();
const users = new sqlite3.Database(userdb);
// Сверяем логин и пароль с данными из БД
async function checkExistUser(req, res, next) {
	const { name, password } = req.body;
	const good = () => next();
	// Получаем юзера из БД
	users.get('SELECT * FROM users WHERE name = ?', [name], async (error, user) => {
		if (error) {
			throw new Error('Ошибка при выполнении запроса');
		}
		if (!user) {
			return res.status(401).json({ error: 'Неверный логин или пароль!' });
		}
		const isPasswordValid = bcrypt.compareSync(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ error: 'Неверный логин или пароль' });
		}
		// Пользователь сущесвует и его пароль верный, передаем информацию дальше
		if (user && isPasswordValid) {
			const secretKey = process.env.JWT_SECRET;
			const token = jwt.sign({ username: name, userrole: res.locals.role }, secretKey);
			console.log('next');
			res.locals.role = user.role;
			res.locals.token = token;
			res.locals.name = user.name;
			good();
		}
	});
}

module.exports = checkExistUser;

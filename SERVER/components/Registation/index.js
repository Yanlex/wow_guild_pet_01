const sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const UserRegistationdbPath = path.resolve(__dirname, '../../db/users.db');

function registerUser(req, res) {
	const usersDB = new sqlite3.Database(UserRegistationdbPath);
	const { name, email, password, role } = req.body;

	if (!name || !email || !password) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	// Проверка на уникальность имени пользователя
	const checkQuery = `SELECT * FROM users WHERE name = ?`;
	usersDB.get(checkQuery, [name], (error, row) => {
		if (error) {
			return res.status(500).json({ error: `Failed to register user ${error} ` });
		}

		if (row) {
			return res.status(409).json({ error: 'Юзернейм уже занят' });
		}

		// Если имя пользователя уникальное, выполняем вставку данных в таблицу
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(password, salt, (err, hashpw) => {
				bcrypt.hash(email, salt, (err, hashem) => {
					if (err) throw err;
					const insertQuery = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
					const user = 'user';
					usersDB.run(insertQuery, [name, hashem, hashpw, user], (error) => {
						if (error) {
							usersDB.close();
							return res.status(500).json({ error: 'Юзернейм не занят, но есть ошибка' });
						}
						usersDB.close();
						return res.status(200).json({ message: 'Юзер успешно зарегистрирован' });
					});
				});
			});
		});
	});
}
module.exports = registerUser;

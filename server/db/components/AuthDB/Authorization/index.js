require('dotenv').config();
const jwt = require('jsonwebtoken');

async function authCheck(req, res) {
	const token = req.body.token;
	const secretKey = process.env.JWT_SECRET;
	// Проверка валидности токена
	jwt.verify(token, secretKey, (err, decoded) => {
		if (err) {
			// Ошибка верификации токена
			console.log(err);
			res.status(401).json(false);
		} else {
			// Верификация успешна, возвращает юзернейм и роль
			const { userrole, username } = decoded;
			res.json({ userrole, username });
		}
	});
}

module.exports = authCheck;

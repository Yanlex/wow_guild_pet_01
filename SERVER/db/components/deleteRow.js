// просто шаблон на удаление строки из БД

const sqlite3 = require('sqlite3').verbose();

// Открываем соединение с базой данных SQLite3
const db = new sqlite3.Database('../guild.db');

async function test() {
	const rows = await new Promise((resolve, reject) => {
		db.all('SELECT character_name FROM members', (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
	console.log(rows[0].character_name);
}

test();

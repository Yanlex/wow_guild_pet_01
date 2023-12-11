// eslint-disable-next-line @typescript-eslint/no-var-requires
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./users.db');

const sql = `INSERT INTO users(id, name, email, password, role) VALUES(?, ?, ?, ?, ?)`;
const data = [3, 'admin1', 'email@email.ru', 'password', 'admin1'];

db.run(sql, data, function (err) {
	if (err) {
		return console.error(err.message);
	}
	console.log(`Row inserted with rowid ${this.lastID}`);
});

db.close((err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Close the database connection.');
});

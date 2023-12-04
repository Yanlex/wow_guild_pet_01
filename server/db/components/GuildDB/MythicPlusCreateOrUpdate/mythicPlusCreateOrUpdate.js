const sqlite3 = require('sqlite3').verbose();
const https = require('https');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../../guild.db');
const INTERVAL_DELAY = 340; // интервал чтобы не превысить количество запросов к апи
const db = new sqlite3.Database(dbPath);

db.serialize(async () => {
	// Проверяем, есть ли столбец mythic_plus_score_dfs3 в таблице members
	const row = await new Promise((resolve, reject) => {
		db.get(
			`SELECT COUNT(*) as cnt FROM sqlite_master WHERE name='members' and type='table' and sql LIKE '%mythic_plus_score_dfs3%'`,
			(err, row) => {
				if (err) {
					reject(err);
				} else {
					resolve(row);
				}
			},
		);
	});

	if (row.cnt === 0) {
		// Если столбца нет, создаем его
		await new Promise((resolve, reject) => {
			db.run('ALTER TABLE members ADD COLUMN mythic_plus_score_dfs3 INTEGER', (err) => {
				if (err) {
					reject(err);
				} else {
					console.log('Столбец mythic_plus_score_dfs3 успешно создан');
					resolve();
				}
			});
		});
	}

	// Получаем список персонажей
	const rows = await new Promise((resolve, reject) => {
		db.all('SELECT character_name FROM members WHERE mythic_plus_score_dfs3', (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});

	// Проходим по списку персонажей и обновляем значения mythic_plus_score_dfs3
	let i = 0;
	const interval = setInterval(() => {
		if (i >= rows.length) {
			clearInterval(interval);
			db.close(); // закрываем соединение с базой данных после выполнения всех операций
			return;
		}

		const name = rows[i].character_name;
		const url = `https://raider.io/api/v1/characters/profile?region=eu&realm=howling-fjord&name=${name}&fields=mythic_plus_scores_by_season%3Acurrent`;

		https
			.get(url, (res) => {
				let data = '';

				res.on('data', (chunk) => {
					data += chunk;
				});

				res.on('end', () => {
					const result = JSON.parse(data);
					const score = result.mythic_plus_scores_by_season[0].scores.all;

					db.run(
						`UPDATE members SET mythic_plus_score_dfs3 = ${score} WHERE character_name = '${name}'`,
						(err) => {
							if (err) {
								console.error(err.message);
							} else {
								console.log(`Строка с ником ${name} успешно обновлена`);
							}
						},
					);
				});
			})
			.on('error', (err) => {
				console.error(err.message);
			});

		i++;
	}, INTERVAL_DELAY);
});

const sqlite3 = require('sqlite3').verbose();
const https = require('https');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../../guild.db');
const INTERVAL_DELAY = 1000; // интервал чтобы не превысить количество запросов к апи
const db = new sqlite3.Database(dbPath);

function checkPlayerGuild() {
	db.serialize(async () => {
		// Получаем список персонажей
		const rows = await new Promise((resolve, reject) => {
			db.all('SELECT character_name FROM members', (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});

		// Проходим по списку персонажей и обновляем значения player_guild
		let i = 0;
		const interval = setInterval(() => {
			if (i >= rows.length) {
				clearInterval(interval);
				db.close(); // закрываем соединение с базой данных после выполнения всех операций
				return;
			}

			const name = rows[i].character_name;
			const url = `https://raider.io/api/v1/characters/profile?region=eu&realm=howling-fjord&name=${name}&fields=guild`;

			https
				.get(url, (res) => {
					let data = '';

					res.on('data', (chunk) => {
						data += chunk;
					});

					res.on('end', () => {
						const result = JSON.parse(data);
						const score = result.guild && result.guild.name !== null ? result.guild.name : 'Bomj';

						db.run(
							`UPDATE members SET player_guild = '${score}' WHERE character_name = '${name}'`,
							(err) => {
								if (err) {
									console.log(result);
									console.log(score);
									console.error(err.message);
								} else {
									console.log(`Строка с ником ${name} успешно обновлена player_guild`);
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
}
module.exports = checkPlayerGuild;

const guildData = require('../fetchGuild/fetchGuild');
const path = require('path');
const dbPath = path.resolve(__dirname, '../../../guild.db');

async function updateGuildMemberList() {
	const data = await guildData.getGuildData(); // получаем данные гильдии
	// подключаем базу
	const sqlite3 = require('sqlite3').verbose();
	// соединение
	const db = new sqlite3.Database(dbPath);

	db.get(`SELECT id FROM guild WHERE name = ?`, [data.name], function (err, row) {
		if (err) {
			return console.log(err.message);
		}
		if (row) {
			// обновляем данные
			db.run(
				`UPDATE guild SET faction = ?, region = ?, realm = ?, last_crawled_at = ?, profile_url = ? WHERE name = ?`,
				[data.faction, data.region, data.realm, data.last_crawled_at, data.profile_url, data.name],
				function (err) {
					if (err) {
						return console.log(err.message);
					}
					console.log(`Row with name ${data.name} has been updated in guild`);
				},
			);
		} else {
			// вставляем новые данные
			db.run(
				`INSERT INTO guild (name, faction, region, realm, last_crawled_at, profile_url) VALUES (?, ?, ?, ?, ?, ?)`,
				[data.name, data.faction, data.region, data.realm, data.last_crawled_at, data.profile_url],
				function (err) {
					if (err) {
						return console.log(err.message);
					}
					console.log(`A row has been inserted into guild with name ${data.name}`);
				},
			);
		}
	});

	// вносим данные
	data.members.forEach((member) => {
		db.get(
			`SELECT id FROM members WHERE character_name = ?`,
			[member.character.name],
			function (err, row) {
				if (err) {
					return console.log(err.message);
				}
				if (row) {
					// обновляем данные
					db.run(
						`UPDATE members SET guild_id = ?,player_guild = ?, rank = ?, race = ?, class = ?,  active_spec_name = ?, active_spec_role = ?, gender = ?, faction = ?, achievement_points = ?, honorable_kills = ?, region = ?, realm = ?, last_crawled_at = ?, profile_url = ?, profile_banner = ? WHERE character_name = ?`,
						[
							data.id,
							data.name,
							member.rank,
							member.character.race,
							member.character.class,
							member.character.active_spec_name,
							member.character.active_spec_role,
							member.character.gender,
							member.character.faction,
							member.character.achievement_points,
							member.character.honorable_kills,
							member.character.region,
							member.character.realm,
							member.character.last_crawled_at,
							member.character.profile_url,
							member.character.profile_banner,
							member.character.name,
						],
						function (err) {
							if (err) {
								return console.log(err.message);
							}
							console.log(
								`Row with character_name ${member.character.name} has been updated in members`,
							);
						},
					);
				} else {
					// вставляем новые данные
					db.run(
						`INSERT INTO members (guild_id,player_guild = ?, rank, character_name, race, class, active_spec_name, active_spec_role, gender, faction, achievement_points, honorable_kills, region, realm, last_crawled_at, profile_url, profile_banner) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
						[
							data.id,
							data.name,
							member.rank,
							member.character.name,
							member.character.race,
							member.character.class,
							member.character.active_spec_name,
							member.character.active_spec_role,
							member.character.gender,
							member.character.faction,
							member.character.achievement_points,
							member.character.honorable_kills,
							member.character.region,
							member.character.realm,
							member.character.last_crawled_at,
							member.character.profile_url,
							member.character.profile_banner,
						],
						function (err) {
							if (err) {
								return console.log(err.message);
							}
							console.log(
								`A row has been inserted into members with character_name ${member.character.name}`,
							);
						},
					);
				}
			},
		);
	});
	// закончили работу с БД, закрываем
	db.close();
}
module.exports = updateGuildMemberList;

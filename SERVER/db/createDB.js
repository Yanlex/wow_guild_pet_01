// Создаем базу данных.

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./guild.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the database.');
});

db.serialize(() => {
	db.run(`CREATE TABLE guild (
            id INTEGER PRIMARY KEY,
            name TEXT,
            faction TEXT,
            region TEXT,
            realm TEXT,
            last_crawled_at TEXT,
            profile_url TEXT
          );`);

	db.run(`CREATE TABLE members (
            id INTEGER PRIMARY KEY,
            guild_id INTEGER,
            rank INTEGER,
            character_name TEXT,
            race TEXT,
            class TEXT,
            active_spec_name TEXT,
            active_spec_role TEXT,
            gender TEXT,
            faction TEXT,
            achievement_points INTEGER,
            honorable_kills INTEGER,
            region TEXT,
            realm TEXT,
            last_crawled_at TEXT,
            profile_url TEXT,
            profile_banner TEXT,
            mythic_plus_score INTEGER,
            thumbnail_url TEXT,
            player_guild TEXT,
            mythic_plus_score_dfs3 INTEGER
          );`);
});

db.close((err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Close the database connection.');
});

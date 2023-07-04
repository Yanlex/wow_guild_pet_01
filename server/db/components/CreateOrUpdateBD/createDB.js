const guildData = require('../fetchGuild/fetchGuild');
const path = require('path');
const dbPath = path.resolve(__dirname, '../../guild.db');




async function initializeDatabase() {
  const data = await guildData.getGuildData(); // получаем данные гильдии
  console.log(data)

  // подключаем базу
  const sqlite3 = require('sqlite3').verbose();

  // соединение
  const db = new sqlite3.Database(dbPath);

  // проверяем существование таблицы guild
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='guild'", [], function (err, row) {
    if (err) {
      return console.log(err.message);
    }
    if (!row) {
      // создать таблицу
      db.run('CREATE TABLE guild (id INTEGER PRIMARY KEY, name TEXT, faction TEXT, region TEXT, realm TEXT, last_crawled_at TEXT, profile_url TEXT)', [], function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log(`Table guild has been created`);
      });
    }
  });

  // проверяем существование таблицы members
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='members'", [], function (err, row) {
    if (err) {
      return console.log(err.message);
    }
    if (!row) {
      // создать таблицу
      db.run('CREATE TABLE members (id INTEGER PRIMARY KEY, guild_id INTEGER, rank INTEGER, character_name TEXT, race TEXT, class TEXT, active_spec_name TEXT, active_spec_role TEXT, gender TEXT, faction TEXT, achievement_points INTEGER, honorable_kills INTEGER, region TEXT, realm TEXT, last_crawled_at TEXT, profile_url TEXT, profile_banner TEXT)', [], function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log(`Table members has been created`);
      });
    }
  });

  // вносим данные
  data.members.forEach((member) => {
    db.get(`SELECT id FROM members WHERE character_name = ?`, [member.character.name], function (err, row) {
      if (err) {
        return console.log(err.message);
      }
      if (row) {
        // обновляем данные
        db.run(`UPDATE members SET guild_id = ?, rank = ?, race = ?, class = ?, active_spec_name = ?, active_spec_role = ?, gender = ?, faction = ?, achievement_points = ?, honorable_kills = ?, region = ?, realm = ?, last_crawled_at = ?, profile_url = ?, profile_banner = ? WHERE character_name = ?`, [data.id, member.rank, member.character.race, member.character.class, member.character.active_spec_name, member.character.active_spec_role, member.character.gender, member.character.faction, member.character.achievement_points, member.character.honorable_kills, member.character.region, member.character.realm, member.character.last_crawled_at, member.character.profile_url, member.character.profile_banner, member.character.name], function (err) {
          if (err) {
            return console.log(err.message);
          }
          console.log(`Row with character_name ${member.character.name} has been updated in members`);
        });
      } else {
        // вставляем новые данные
        db.run(`INSERT INTO members (guild_id, rank, character_name, race, class, active_spec_name, active_spec_role, gender, faction, achievement_points, honorable_kills, region, realm, last_crawled_at, profile_url, profile_banner) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [data.id, member.rank, member.character.name, member.character.race, member.character.class, member.character.active_spec_name, member.character.active_spec_role, member.character.gender, member.character.faction, member.character.achievement_points, member.character.honorable_kills, member.character.region, member.character.realm, member.character.last_crawled_at, member.character.profile_url, member.character.profile_banner], function (err) {
          if (err) {
            return console.log(err.message);
          }
          console.log(`A row has been inserted into members with character_name ${member.character.name}`);
        });
      }
    });
  });

  // закончили работу с БД, закрываем 
  db.close();
}

initializeDatabase();
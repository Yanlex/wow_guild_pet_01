const sqlite3 = require('sqlite3').verbose();
const https = require('https');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../guild.db');

const INTERVAL_DELAY = 340; // интервал чтобы не превысить количество запросов к апи

const db = new sqlite3.Database(dbPath);

db.serialize(async function () {
  // Проверяем, есть ли столбец thumbnail_url в таблице members
  const row = await new Promise((resolve, reject) => {
    db.get(`SELECT COUNT(*) as cnt FROM sqlite_master WHERE name='members' and type='table' and sql LIKE '%thumbnail_url%'`, [], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });

  if (row.cnt === 0) {
    // Если столбца нет, создаем его
    await new Promise((resolve, reject) => {
      db.run('ALTER TABLE members ADD COLUMN thumbnail_url TEXT', (err) => {
        if (err) {
          reject(err);
        } else {
          console.log("Столбец thumbnail_url успешно создан");
          resolve();
        }
      });
    });
  }

  const rows = await new Promise((resolve, reject) => {
    db.all('SELECT character_name FROM members', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  // Закрываем БД после всех операций
  let i = 0;
  const interval = setInterval(() => {
    if (i >= rows.length) {
      clearInterval(interval);
      db.close(); // закрываем соединение с базой данных после выполнения всех операций
      return;
    }

    const name = rows[i].character_name;
    const url = `https://raider.io/api/v1/characters/profile?region=eu&realm=howling-fjord&name=${name}&fields=mythic_plus_scores_by_season%3Acurrent`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const result = JSON.parse(data);
        const thumbnail = result.thumbnail_url;

        db.run('UPDATE members SET thumbnail_url = ? WHERE character_name = ?', [thumbnail, name], (err) => {
          if (err) {
            console.error(err.message);
          } else {
            console.log(`Строка с ником ${name} успешно обновлена thumbnail_url`);
          }
        });

      });
    }).on('error', (err) => {
      console.error(err.message);
    });

    i++;
  }, INTERVAL_DELAY);
});
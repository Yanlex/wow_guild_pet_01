async function removerowdb(req, res) {
  const path = require('path');
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = path.resolve(__dirname, '../../auth.db');
  const db = new sqlite3.Database(dbPath);

  const rowName = req.params.name
  const rowType = req.params.type

  try {
    // Проверяем, есть ли столбец в таблице members
    const row = await new Promise((resolve, reject) => {
      db.get(`SELECT COUNT(*) as cnt FROM sqlite_master WHERE name='auth' and type='table' and sql LIKE '%${rowName}%'`, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (row.cnt === 1) {
      // Если столбца нет, создаем его
      await new Promise((resolve, reject) => {
        db.run(`ALTER TABLE auth DROP COLUMN ${rowName}`, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      res.send(`Столбец ${rowName} успешно удален!`);
    } else {
      res.send(`Столбец ${rowName} не сущесвует!`)
    }
  } catch (err) {
    res.send(err);
  }
}

module.exports = removerowdb;

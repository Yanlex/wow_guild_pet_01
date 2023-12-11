const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../users.db");

function usersDB() {
  // Создадим таблицу для пользователей
  db.serialize(() => {
    db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
      [],
      (err, row) => {
        if (err) {
          return console.log(err.message);
        }
        if (row) {
          db.close();
          return console.log("Таблица users существует!");
        }
        if (!row) {
          // создать таблицу
          db.run(
            "CREATE TABLE IF NOT EXISTS users ( id INTEGER PRIMARY KEY, name TEXT, email TEXT, password TEXT, role TEXT) ",
            [],
            (err) => {
              if (err) {
                return console.log(err.message);
              }
              db.close();
              console.log(`Таблица users была создана`);
            }
          );
        }
      }
    );
  });
}

module.exports = usersDB;

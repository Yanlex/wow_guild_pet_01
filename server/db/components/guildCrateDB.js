async function getAllGuildMembers(res) {
  const sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database('./server/db/database.db');
  db.all('SELECT rank, race, character_name, class FROM members', [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(rows);
    }
  });

}
getAllGuildMembers()
module.exports = { getAllGuildMembers };
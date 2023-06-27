const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const path = require('path');
const config = require('../webpack.config.js');

const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const compiler = webpack(config);
const guildData = require('./fetchGuild/fetchGuild.js');
const dbPath = path.resolve(__dirname, './db/guild.db');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(dbPath);


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.json());
app.use(cors());

// Middleware for serving static files from public directory
app.use(express.static(path.join(__dirname, '../dist')));

// получаем данные гильдии с raider.io
app.get('/guild-data', async (req, res) => {
  const data = await guildData.getGuildData();
  res.send(data)
  console.log('Данные гильдии получены')
});

// Вывод одного игрока
app.get('/member/:name', async (req, res) => {
  const name = req.params.name
  const data = await guildData.getPlayerMythicPlus(name)
  res.send(data)
})

app.get('/members', (req, res) => {

  let sql = `SELECT guild_id, rank, character_name, race, class, active_spec_name, active_spec_role, gender, faction, achievement_points, honorable_kills, region, realm, last_crawled_at, profile_url, profile_banner FROM members`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    const characterNames = rows.map((row) => ({ character_name: row.character_name, class: row.class }))
    res.send(characterNames);

  });
});

// Webpack dev middleware
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

// Route for serving the index file
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../dist', '../dist/index.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Server listening on port ${port}`);
});

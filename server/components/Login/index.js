const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config()
const userdb = path.resolve(__dirname, '../../db/users.db');
const { v4: uuidv4 } = require('uuid');
const redis = require("redis");

let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();


const loginRouter = express.Router();
const users = new sqlite3.Database(userdb);

const sesionUuid = `session_${uuidv4()}`


loginRouter.post('/', async (req, res) => {

  try {
    const { name, password } = req.body;
    users.get('SELECT * FROM users WHERE name = ?', [name], async (error, user) => {
      secretKey = process.env.JWT_SECRET
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      const token = jwt.sign({ username: user.name, userrole: user.role }, secretKey);
      const role = user.role
      const name = user.name
      if (error) {
        throw new Error('Ошибка при выполнении запроса');
      }
      if (!user) {
        return res.status(401).json({ error: 'Неверный логин или пароль!' });
      }

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Неверный логин или пароль' });
      }
      redisClient.set(sesionUuid, token, function (err, reply) {
        if (err) {
          console.error(err);
        } else {
          console.log('Value set in Redis');
        }
      });
      // res.json({ token, role, name });
      res
        .cookie('JWT', token, {
          httpOnly: true
        }).cookie('SessionID', sesionUuid, {
          httpOnly: true,

        })
        .status(200)
        .json({ message: "JWT in successfully 😊 👌" });

    });


  } catch (error) {
    res.status(500).json({ error: 'Что-то пошло не так' });
  }
});

module.exports = loginRouter;

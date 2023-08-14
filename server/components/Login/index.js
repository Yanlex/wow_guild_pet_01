const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config()
const userdb = path.resolve(__dirname, '../../db/users.db');


const loginRouter = express.Router();
const users = new sqlite3.Database(userdb);

loginRouter.post('/', async (req, res) => {
  try {
    const { name, password } = req.body;

    users.get('SELECT * FROM users WHERE name = ?', [name], (error, user) => {
      if (error) {
        throw new Error('Ошибка при выполнении запроса');
      }
      if (!user) {
        return res.status(401).json({ error: 'Неверный логин или пароль!' });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Неверный логин или пароль' });
      }
      secretKey = process.env.JWT_SECRET
      const token = jwt.sign({ username: user.name, userrole: user.role }, secretKey);
      const role = user.role
      const name = user.name

      res.json({ token, role, name });
    });
  } catch (error) {
    res.status(500).json({ error: 'Что-то пошло не так' });
  }
});

module.exports = loginRouter;

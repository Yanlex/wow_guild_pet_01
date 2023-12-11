# wow_guild_pet_01

<p>Идея просто взять данные по апи с рейдер ио, вносить их в БД, обновлять/добавлять и просто вывести на фронт по API с expressJS<br><br>
Над проектом работю Я + ChatGPT</p>

"npm run server" - запуск бэка ( бэк работает на localhost:3000 подтягивает фронт с папки dist )

"npm run dev" - запуск фронта из папки src в дев режиме

"resid-server" - редис

"npm run build" - собираем папку src в dist

На чем работает

- webpack
- react
- expressJS
- sqlite3
- redis-server

### БД

!!Стартовая точка информации по вашей гильдии
/server/db/components/GuildDB/fetchGuild/fetchGuild.js

// SERVER/db/createDB.js создаем БД Гильдии guild.db
// SERVER/db/components/UserDB - создаем базу для юзеров users.db
// SERVER/db/components/GuildDB/GuildMembers/ Заполняет и обновляет данные гильдии
// SERVER/db/components/MythicPlusScoreUpdate/scoreUpdate заполняет или обновляет м+ рейтинг в бд

## Первый запуск

> npm install

// SERVER/db

> [!IMPORTANT]
> Через 20 секунд начнется обновление базы по стороннему API, не закрывайте скрипт!!

> node firstStart.js

Запустить редис сервер и express.

> resid-server

> npm run server

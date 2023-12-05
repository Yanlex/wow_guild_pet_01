# wow_guild_pet_01

Идея просто взять данные по апи с рейдер ио, вносить их в БД, обновлять/добавлять и просто вывести на фронт по API с expressJS
Над проектом работю Я + ChatGPT

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

--- Преднастройка ---
->
!!Стартовая точка информации по вашей гильдии
/server/db/components/GuildDB/fetchGuild/fetchGuild.js
->
node createDB.js // создаем БД гильдии + мемберы
node UsersDB/index.js // создаем БД зарегестрированных юзеров
node GuildMembers/index.js // Заполняет и обновляет данные гильдии, чтобы выполнить этот файл нужно закомментировать cron.schedule в app.js и добавить вызов функции в самом файле
node MythicPlusScoreUpdate/scoreUpdate.js // обновляет м+ рейтинг в бд , чтобы выполнить этот файл нужно закомментировать cron.schedule в app.js и добавить вызов функции в самом файле

---- Первый запуск ----
resid-server
npm run server
npm run dev

# wow_guild_pet_01

Идея просто взять данные по апи с рейдер ио, вносить их в БД, обновлять/добавлять и просто вывести на фронт по API с expressJS
Над проектом работю Я + ChatGPT

"npm run server" - запуск бэка ( бэк работает на localhost:3000 подтягивает фронт с папки dist )
"npm run dev" - запуск фронта из папки src в дев режиме
"npm run build" - собираем папку src в dist

На чем работает
- webpack
- react
- expressJS
- sqlite3

Запуск через node filename.js
db-components-CreateOrUpdateBD-createDB.js отвечает за создание БД / Обновление строк / Добавление строк ( берем инфу гильдии по апи рейдер рио )
db-components-MythicPlusCreateOrUpdate-mythicPlusCreateOrUpdate.js отвечает за добавление стобца mythic_plus_score в таблицу members / Также обновляет содержимое строк mythic_plus_score и обновлении информации в втроках по этому слобцу
db-components-PlayerGuild-CreateOrUpd.js отвечает за создание столбца player_guild и обновлении информации в втроках по этому слобцу
db-components-Thumbnail_url-thumbnail_url.js отвечает за создание столбца thumbnail_url и обновлении информации в втроках по этому слобцу
db-components-fetchGuild-fetchGuild.js функции запросы к апи рейдер ио

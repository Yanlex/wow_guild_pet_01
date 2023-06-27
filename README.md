# wow_guild_pet_01

Идея просто взять данные по апи с рейдер ио, вносить их в БД, обновлять/добавлять и просто вывести на фронт по API с expressJS
Над проектом работю Я + ChatGPT

На чем работает
- webpack
- react
- expressJS
- sqlite3

db-components-createDB.js отвечает за создание БД / Обновление строк / Добавление строк ( запуск через node createDB.js  )
db-components-mythicPlusCreateOrUpdate.js отвечает за добавление стобца mythic_plus_score в таблицу members / Также проверяет и обновляет содержимое строки mythic_plus_score ( запуск через node createDB.js mythicPlusCreateOrUpdate.js )

**27-06-2023**
Залил, основная работа продела на беке, фронт пока почти не работает.

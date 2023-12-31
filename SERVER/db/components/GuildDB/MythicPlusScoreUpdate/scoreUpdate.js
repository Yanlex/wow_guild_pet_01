// ОБНОВЛЯЕМ В СТОЛБЦЕ mythic_plus_score_dfs3 РИО ИГРОКОВ

const mythic_plus_score_dfs3 = () => {
  const https = require("https");
  const INTERVAL_DELAY = 340; // интервал чтобы не превысить количество запросов к апи
  const sqlite3 = require("sqlite3").verbose();
  const path = require("path");
  const dbPath = path.resolve(__dirname, "../../../guild.db");
  const db = new sqlite3.Database(dbPath);
  const responseM = (resq) => {
    console.log(resq);
  };
  db.serialize(async () => {
    // Получаем список персонажей
    try {
      const rows = await new Promise((resolve, reject) => {
        db.all("SELECT character_name FROM members", (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });

      // Проходим по списку персонажей и обновляем значения mythic_plus_score_dfs3
      let i = 0;
      const interval = setInterval(() => {
        if (i >= rows.length) {
          clearInterval(interval);
          console.log("МЫ ЗАКОНЧИЛИ!");
          db.close(); // закрываем соединение с базой данных после выполнения всех операций
          return;
        }

        const name = rows[i].character_name;
        const url = `https://raider.io/api/v1/characters/profile?region=eu&realm=howling-fjord&name=${name}&fields=mythic_plus_scores_by_season%3Acurrent`;

        const req = https.get(url, (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            try {
              const result = JSON.parse(data);
              const score = result.mythic_plus_scores_by_season[0].scores.all;

              db.run(
                "UPDATE members SET mythic_plus_score_dfs3 = ? WHERE character_name = ?",
                [score, name],
                (err) => {
                  if (err) {
                    console.error(err.message);
                  } else {
                    responseM(`Строка с ником ${name} успешно обновлена`);
                  }
                }
              );
            } catch (error) {
              console.error(
                `Ошибка обработки данных для персонажа ${name}: ${error.message}`
              );
            }
          });
        });

        req.on("error", (error) => {
          console.error(
            `Ошибка при выполнении запроса для персонажа ${name}: ${error.message}`
          );
        });

        i++;
      }, INTERVAL_DELAY);
    } catch (error) {
      console.error(`Ошибка при получении списка персонажей: ${error.message}`);
    }
  });
};
// mythic_plus_score_dfs3();
module.exports = mythic_plus_score_dfs3;

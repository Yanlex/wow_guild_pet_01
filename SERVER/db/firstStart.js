const updateGuildMemberList = require("./components/GuildDB/GuildMembers");
const mythic_plus_score_dfs3 = require("./components/GuildDB/MythicPlusScoreUpdate/scoreUpdate");
const usersDB = require("./components/UsersDB");
const createDB = require("./createDB");

function start() {
  try {
    createDB();
    usersDB();
    updateGuildMemberList();
  } catch (e) {
    console.log(`FirstStart File ${e}`);
  } finally {
    console.log("Finally");
    setTimeout(mythic_plus_score_dfs3, 20000);
  }
}

start();

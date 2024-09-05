const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("./database/games.sqlite", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("database connected");
});

db.run(
  "CREATE TABLE IF NOT EXISTS games(id INTEGER PRIMARY KEY, title VARCHAR(50), year INTEGER, price REAL);",
  (err) => {
    if(err){
        console.error(err.message);
    };
  }
);
db.run(
  "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name VARCHAR(50), email VARCHAR(80), password TEXT);",
  (err) => {
    if(err){
        console.error(err.message);
    };
  }
);

module.exports = db;
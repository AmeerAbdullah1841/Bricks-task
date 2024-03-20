const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./taskmanager.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the taskmanager database.");
});
db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    completed INTEGER DEFAULT 0
)`);
module.exports = db;

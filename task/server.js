const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/tasks", (req, res) => {
  const { description } = req.body;
  if (!description) {
    res.status(400).json({ error: "Task description is required" });
    return;
  }
  const sql = "INSERT INTO tasks (description) VALUES (?)";
  db.run(sql, [description], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, description, completed: 0 });
  });
});
app.put("/tasks/:id", (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;
  const sql = "UPDATE tasks SET completed = ? WHERE id = ?";
  db.run(sql, [completed, id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id, completed });
  });
});
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tasks WHERE id = ?";
  db.run(sql, id, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "Task deleted" });
  });
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

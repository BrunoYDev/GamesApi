const express = require("express");
const app = express();
const db = require("./database/database");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/games", (req, res) => {
  db.all("SELECT * FROM games", (err, games) => {
    if (err) {
      res.status(500).json({ message: "Error fetching games" });
      return;
    }
    res.status(200).json(games);
  });
});

app.get("/games/:id", (req, res) => {
  let id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: `${req.params.id} is not a valid ID` });
    return;
  }

  db.get("SELECT * FROM games WHERE id = ?", [id], (err, game) => {
    if (err) {
      res.status(500).json({ message: "Error fetching game" });
      return;
    }
    if (!game) {
      res.status(404).json({ message: "Game not found" });
      return;
    }
    res.status(200).json(game);
  });
});

app.post("/games", (req, res) => {
  let { title, year, price } = req.body;
  if (
    isNaN(year) ||
    isNaN(price) ||
    year === undefined ||
    price === undefined ||
    title === undefined
  ) {
    res.status(400).json({ message: "Fill the body request correctly" });
    return;
  }

  db.get("SELECT * FROM games WHERE title = ?", [title], (err, game) => {
    if (err) {
      res.status(500).json({ message: "Error checking game existence" });
      return;
    }

    if (game) {
      res.status(409).json({ message: "This game is already registered" });
    } else {
      db.run(
        "INSERT INTO games(title, year, price) VALUES(?, ?, ?)",
        [title, year, price],
        (err) => {
          if (err) {
            res.status(500).json({ message: "Error creating game" });
            return;
          }
          res.status(201).json({ message: "Game Created" });
        }
      );
    }
  });
});

app.patch("/games/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let { title, year, price } = req.body;

  if (!title && !year && !price) {
    res.status(400).json({ message: "No fields provided for update" });
    return;
  }

  let updates = []; // Fields to be updated
  let values = []; // Values to be changed

  if (title) {
    updates.push("title = ?");
    values.push(title);
  }
  if (year) {
    updates.push("year = ?");
    values.push(year);
  }
  if (price) {
    updates.push("price = ?");
    values.push(price);
  }

  values.push(id);

  let sql = `UPDATE games SET ${updates.join(", ")} WHERE id = ?`;

  db.run(sql, values, function(err) {
    if (err) {
      res.status(500).json({ message: "Error updating game" });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ message: "Game not found" });
    } else {
      res.status(200).json({ message: "Game updated successfully" });
    }
  });
});

app.delete("/games/:id", (req, res) => {
  let id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: `${req.params.id} is not a valid ID` });
    return;
  }

  db.run("DELETE FROM games WHERE id = ?", [id], function(err) {
    if (err) {
      res.status(500).json({ message: "Error deleting game" });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ message: "Game not found" });
    } else {
      res.status(200).json({ message: "Game deleted successfully" });
    }
  });
});

app.listen(3000, () => {
  console.log("Api running on http://localhost:3000");
});

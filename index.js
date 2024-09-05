const express = require("express");
const app = express();
const db = require("./database/database");
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecretKey = process.env.SECRET_KEY;

const auth = (req,res,next) => {
  const authToken = req.headers['authorization'];
  if(!authToken){
    res.status(401).json({message: "Invalid Token!"});
    return;
  }

  const bearer = authToken.split(' ');
  const token = bearer[1];

  jwt.verify(token, jwtSecretKey,(err,data) => {
    if(err){
      res.status(401).json({message: "Unhatorized"});
      return;
    }
    req.token = token;
    req.loggedUser = {id: data.id, email: data.email};
    next();
  })

}

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//games routes
app.get("/games", auth, (req, res) => {
  db.all("SELECT * FROM games", (err, games) => {
    if (err) {
      res.status(500).json({ message: "Error fetching games" });
      return;
    }
    res.status(200).json(games);
  });
});

app.get("/games/:id", auth, (req, res) => {
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

app.post("/games", auth, (req, res) => {
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

app.patch("/games/:id", auth, (req, res) => {
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

app.delete("/games/:id", auth, (req, res) => {
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
      res.status(204).json({ message: "Game deleted successfully" });
    }
  });
});

//user routes

app.post("/users", (req, res) => {
  let { name, email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password,salt);

  if (
    name === undefined ||
    email === undefined ||
    password === undefined
  ) {
    res.status(400).json({ message: "Fill the body request correctly" });
    return;
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) {
      res.status(500).json({ message: "Error checking user existence" });
      return;
    }

    if (user) {
      res.status(409).json({ message: "This email is already registered" });
    } else {
      db.run(
        "INSERT INTO users(name, email, password) VALUES(?, ?, ?)",
        [name, email, hash],
        (err) => {
          if (err) {
            res.status(500).json({ message: "Error creating user" });
            return;
          }
          res.status(201).json({ message: "User Created" });
        }
      );
    }
  });
});

app.get("/users", auth, (req, res) => {
  db.all("SELECT id, name, email FROM users;", (err, users) => {
    if (err) {
      res.status(500).json({ message: "Error fetching users" });
      return;
    }
    res.status(200).json(users);
  });
});

app.post('/auth', (req,res) => {
  let {email, password} = req.body;

  if(email === undefined || password === undefined){
    res.status(400).json({message: "Invalid email or password"});
  }

  db.get("SELECT * FROM users WHERE email = ?;",[email], (err, user) => {
    if (err) {
      res.status(500).json({ message: "Error checking user existence" });
      return;
    };

    if(!user || user == undefined){
      res.status(404).json({message: "User doesn't exists"});
      return;
    }

    let compare = bcrypt.compareSync(password, user.password);

    if(user && compare){

      jwt.sign({id: user.id,email: user.email}, jwtSecretKey, {expiresIn: '72h'},(err,token) => {
        if(err){
          res.status(400).json({message: "Internal Failure" + err.message});
        }
        res.status(200).json({token: token});
      });

    }else{
      res.status(401).json({message: "Incorret email or Password"});
    }

  });

});

app.listen(3000, () => {
  console.log("Api running on http://localhost:3000");
});

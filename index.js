const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let database = {
  games: [
    {
      id: 1,
      title: "Call of duty Modern Warfare",
      year: 2019,
      price: 60,
    },
    {
      id: 2,
      title: "Minecraft",
      year: 2009,
      price: 100,
    },
    {
      id: 3,
      title: "League of legends",
      year: 2009,
      price: 0,
    },
  ],
};

app.get("/games", (req, res) => {
  res.status(200);
  res.json(database.games);
});

app.listen(3000, () => {
  console.log("Api running on http://localhost:3000");
});

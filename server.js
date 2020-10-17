require("dotenv").config();

const api = require("./api");
const express = require("express");
const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host : process.env.DB_HOST,
  user : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE,
  connectionLimit : 5,
});

const app = express();

app.use(express.static("./dist/PlantsHub"));

app.get("/*",
        (req, res) => res.sendFile("index.html", {root : "dist/PlantsHub/"}));

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is listening on port ${process.env.PORT || 8080}`);
});

app.post("/api/create-item/:item_id/:item_name",
         (req, res) => { api.createItem(pool, req, res); });

require("dotenv").config();

const express = require("express");
const mariadb = require("mariadb");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const user_api = require("./Backend/user_api");
const plant_api = require("./Backend/plant_api");
const rateLimit = require("express-rate-limit");
// const cors = require('cors');

const pool = mariadb.createPool({
  host : process.env.DB_HOST,
  user : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE,
  connectionLimit : 3,
});

const limiter = rateLimit({
  windowMs : 15 * 60 * 1000, // 15 minutes
  max : 100                  // limit each IP to 100 requests per windowMs
});

const app = express();

app.use(limiter)
app.use(express.static("./dist/PlantsHub"));
app.use(cookieParser());
app.use(bodyParser());
// app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin",
             "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers",
             "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/*",
        (req, res) => res.sendFile("index.html", {root : "dist/PlantsHub/"}));

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is listening on port ${process.env.PORT || 8080}`);
});

/**
 * USER API
 */
app.post("/api/create-user",
         (req, res) => { user_api.createUser(pool, req, res); });

app.post("/api/check-credentials",
         (req, res) => { user_api.checkUserCredentials(pool, req, res); });

app.post("/api/check-session",
         (req, res) => { user_api.checkUserSession(pool, req, res); });

/**
 * PLANT API
 */
app.post("/api/create-plant",
         (req, res) => { plant_api.createPlant(pool, req, res); });

app.post("/api/update-plant",
         (req, res) => { plant_api.updatePlant(pool, req, res); });

app.post("/api/get-plants",
         (req, res) => { plant_api.getPlants(pool, req, res); });

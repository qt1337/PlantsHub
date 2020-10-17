require('dotenv').config();

const express = require('express');
const mariadb = require('mariadb');

const pool = mariadb.createPool(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 5
  }
);

const app = express();

app.use(express.static('./dist/PlantsHub'));

app.get('/*', (req, res) =>
  res.sendFile('index.html', {root: 'dist/PlantsHub/'}),
);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is listening on port ${process.env.PORT || 8080}`);
});

app.post('/api/create-item/:item_id/:item_name', (req, res) => {
  pool.getConnection()
    .then(conn => {

      conn.query("SELECT 1 as val")
        .then((rows) => {
          console.log(rows);
          return conn.query("INSERT INTO myTable value (?, ?)", [req.params.item_id, req.params.item_name]);
        })
        .then((resp) => {
          res.status(200).send("rows have been created");
          console.log(resp);
          conn.end();
        })
        .catch(err => {
          res.status(200).send("rows could not be created");
          conn.end();
        })

    }).catch(err => {
    //not connected
  });
});

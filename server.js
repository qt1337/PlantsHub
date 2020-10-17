require('dotenv').config();

const express = require('express');

const server_app = express();

server_app.use(express.static('./dist/PlantsHub'));

server_app.get('/*', (req, res) =>
  res.sendFile('index.html', {root: 'dist/PlantsHub/'}),
);

server_app.listen(process.env.PORT || 8080, () => {
  console.log(`Example app is listening on port http://localhost:${process.env.PORT || 8080}`);
});


// SERVER AAAA
// ===========
// API    VVVV

const api_app = express();
let api_port = 3000;
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


api_app.get('/', ((req, res) => {
  res.send("HELLO Wolrd");
}))

api_app.listen(api_port, () => {
  console.log(`Example app is listening on port http://localhost:${api_port}`);
})

api_app.post('/api/create-item/:item_id/:item_name', (req, res) => {
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

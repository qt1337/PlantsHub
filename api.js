function createItem(pool, req, res) {
  pool.getConnection()
      .then((conn) => {
        conn.query("SELECT 1 as val")
            .then((rows) => {
              console.log(rows);
              return conn.query("INSERT INTO myTable value (?, ?)", [
                req.params.item_id,
                req.params.item_name,
              ]);
            })
            .then((resp) => {
              res.status(200).send("rows have been created");
              console.log(resp);
              conn.end();
            })
            .catch((err) => {
              res.status(200).send("rows could not be created");
              conn.end();
            });
      })
      .catch((err) => {
                 // not connected
             });
}

module.exports = {createItem}

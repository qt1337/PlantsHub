const utility = require("./utility");

/**
 * Creates a plant
 */
function createPlant(pool, req, res) {

  let username = req.body.username;
  let sessionId = req.body.sessionId;
  let plantName = req.body.plantName;
  let wateringInterval = req.body.wateringInterval || null;
  let fertilizingInterval = req.body.fertilizingInterval || null;
  let plantBirthday = req.body.plantBirthday || null;
  let plantDeathday = req.body.plantDeathday || null;
  let family = req.body.family || null;
  let type = req.body.type || null;
  let species = req.body.species || null;
  let image = req.file.path || null;
  let lux = req.body.lux || null;

  pool.getConnection().then((connection) => {
    connection.query("SELECT salt FROM User WHERE username = (?)", [ username ])
        .then((row) => {
          let salt = row[0].salt;

          let hashedSessionId = utility.sha512(sessionId, salt).passwordHash;

          connection
              .query(
                  "SELECT userId FROM User WHERE username = (?) and sessionId = (?)",
                  [ username, hashedSessionId ])
              .then((result) => {
                let userId = result[0].userId;

                connection
                    .query(
                        "INSERT INTO Plant (plantName,userId,wateringInterval,fertilizingInterval,plantBirthday,plantDeathday,family,type,species,image,lux) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                        [
                          plantName,
                          userId,
                          wateringInterval,
                          fertilizingInterval,
                          plantBirthday,
                          plantDeathday,
                          family,
                          type,
                          species,
                          image,
                          lux,
                        ])
                    .then((result) => {
                      connection.end();
                      return this.getPlants(pool, req, res);
                    })
                    .catch((err) => {
                      console.log(err);
                      res.status(401).send("rows could not be created");
                    });
              })
              .catch((err) => {
                console.log(err);
                res.status(401).send("rows could not be found");
              });
        })
        .catch((err) => {
          console.log(err);
          // not connected
        });
    connection.end();
  });
}

/**
 * Update a plant
 */
function updatePlant(pool, req, res) {
  let username = req.body.username;
  let sessionId = req.body.sessionId;
  let plantId = req.body.plantId;
  let plantName = req.body.plantName || null;
  let wateringInterval = req.body.wateringInterval || null;
  let fertilizingInterval = req.body.fertilizingInterval || null;
  let plantBirthday = req.body.plantBirthday || null;
  let plantDeathday = req.body.plantDeathday || null;
  let family = req.body.family || null;
  let type = req.body.type || null;
  let species = req.body.species || null;
  let image = req.body.image || null;
  let lux = req.body.lux || null;
  let favourite = req.body.favourite || false;

  pool.getConnection().then((connection) => {
    connection.query("SELECT salt FROM User WHERE username = (?)", [ username ])
        .then((row) => {
          let salt = row[0].salt;

          let hashedSessionId = utility.sha512(sessionId, salt).passwordHash;

          connection
              .query(
                  "SELECT userId FROM User WHERE username = (?) and sessionId = (?)",
                  [ username, hashedSessionId ])
              .then((result) => {
                let userId = result[0].userId;
                connection
                    .query(
                        "UPDATE Plant SET plantName = COALESCE((?),plantName),userId = COALESCE((?),userId),wateringInterval = COALESCE((?),wateringInterval),fertilizingInterval = COALESCE((?),fertilizingInterval),plantBirthday = COALESCE((?),plantBirthday),plantDeathday = COALESCE((?),plantDeathday),family = COALESCE((?),family),type = COALESCE((?),type),species = COALESCE((?),species),image = COALESCE((?),image),lux = COALESCE((?),lux), favourite = COALESCE((?),favourite) WHERE plantId = (?)",
                        [
                          plantName,
                          userId,
                          wateringInterval,
                          fertilizingInterval,
                          plantBirthday,
                          plantDeathday,
                          family,
                          type,
                          species,
                          image,
                          lux,
                          favourite,
                          plantId,
                        ])
                    .then(() => {
                      connection.end();
                      return this.getPlants(pool, req, res);
                    })
                    .catch((err) => {
                      console.log(err);
                      res.status(401).send("rows could not be updated");
                    });
              })
              .catch((err) => {
                console.log(err);
                res.status(401).send("rows could not be found");
              });
        })
        .catch((err) => {
          console.log(err);
          // not connected
        });
    connection.end();
  });
}

/**
 * Get all plants a user owns
 */
function getPlants(pool, req, res) {
  let username = req.body.username;
  let sessionId = req.body.sessionId;

  pool.getConnection().then((connection) => {
    connection.query("SELECT salt FROM User WHERE username = (?)", [ username ])
        .then((row) => {
          let salt = row[0].salt;

          let hashedSessionId = utility.sha512(sessionId, salt).passwordHash;

          connection
              .query(
                  "SELECT userId FROM User WHERE username = (?) and sessionId = (?)",
                  [ username, hashedSessionId ])
              .then((result) => {
                if (!result[0]) {
                  res.status(401).send("invalid session");
                  connection.end();
                  return;
                }
                let userId = result[0].userId;

                connection
                    .query("SELECT * FROM Plant WHERE userId = (?)", [ userId ])
                    .then((result) => { res.status(202).json(result); })
                    .catch((err) => {
                      console.log(err);
                      res.status(401).send("rows could not be updated");
                    });
              })
              .catch((err) => {
                console.log(err);
                res.status(401).send("rows could not be found");
              });
        })
        .catch((err) => {
          console.log(err);
          // not connected
        });

    connection.end();
  });
}

module.exports = {
  createPlant,
  updatePlant,
  getPlants
};

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
  let plantBirthday = new Date(Date.parse(req.body.plantBirthday)) || null;
  let plantDeathday = req.body.plantDeathday || null;
  let family = req.body.family || null;
  let type = req.body.type || null;
  let species = req.body.species || null;
  let image = null;
  if (req.file) {
    image =
      req.file.path ||
      "https://images.pexels.com/photos/6847584/pexels-photo-6847584.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500";
  } else {
    image =
      "https://images.pexels.com/photos/6847584/pexels-photo-6847584.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500";
  }
  let lux = req.body.lux || null;

  pool.getConnection().then((connection) => {
    connection
      .query("SELECT salt, userId FROM User WHERE username = (?)", [username])
      .then((row) => {
        if (!row[0]) {
          res.status(401).send("session not valid");
          conn.end();
          return;
        }
        let salt = row[0].salt;
        let userId = row[0].userId;

        let hashedSession = utility.sha512(sessionId, salt).passwordHash;
        connection.end();

        connection
          .query(
            "SELECT userId FROM Session WHERE userId = (?) and sessionHash = (?)",
            [userId, hashedSession]
          )
          .then((row) => {
            if (!row[0]) {
              res.status(401).send("session not valid");
              connection.end();
              return;
            }
            connection.end();

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
                ]
              )
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
  let plantId = req.body.plant.plantId;
  let plantName = req.body.plant.plantName || null;
  let wateringInterval = req.body.plant.wateringInterval || null;
  let fertilizingInterval = req.body.plant.fertilizingInterval || null;
  let plantBirthday = new Date(Date.parse(req.body.plant.plantBirthday)) || null;
  let plantDeathday = req.body.plant.plantDeathday || null;
  let family = req.body.plant.family || null;
  let type = req.body.plant.type || null;
  let species = req.body.plant.species || null;
  let image = req.body.plant.image || null;
  let lux = req.body.plant.lux || null;
  let favourite = req.body.plant.favourite || false;
  let active = req.body.plant.active || false;

  pool.getConnection().then((connection) => {
    connection
      .query("SELECT salt, userId FROM User WHERE username = (?)", [username])
      .then((row) => {
        if (!row[0]) {
          res.status(401).send("session not valid");
          conn.end();
          return;
        }
        let salt = row[0].salt;
        let userId = row[0].userId;

        let hashedSession = utility.sha512(sessionId, salt).passwordHash;
        connection.end();

        connection
          .query(
            "SELECT userId FROM Session WHERE userId = (?) and sessionHash = (?)",
            [userId, hashedSession]
          )
          .then((row) => {
            if (!row[0]) {
              res.status(401).send("session not valid");
              connection.end();
              return;
            }
            connection.end();

            connection
              .query(
                "UPDATE Plant SET plantName = COALESCE((?),plantName),userId = COALESCE((?),userId),wateringInterval = COALESCE((?),wateringInterval),fertilizingInterval = COALESCE((?),fertilizingInterval),plantBirthday = COALESCE((?),plantBirthday),plantDeathday = COALESCE((?),plantDeathday),family = COALESCE((?),family),type = COALESCE((?),type),species = COALESCE((?),species),image = COALESCE((?),image),lux = COALESCE((?),lux), favourite = COALESCE((?),favourite), active = COALESCE((?),active) WHERE plantId = (?)",
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
                  active,
                  plantId,
                ]
              )
              .then(() => {
                connection.end();
                return this.getPlants(pool, req, res);
              })
              .catch((err) => {
                console.log(err);
                res.status(401).send("rows could not be updated");
                connection.end();
              });
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
    connection
      .query("SELECT salt, userId FROM User WHERE username = (?)", [username])
      .then((row) => {
        if (!row[0]) {
          res.status(401).send("session not valid");
          conn.end();
          return;
        }
        let salt = row[0].salt;
        let userId = row[0].userId;

        let hashedSession = utility.sha512(sessionId, salt).passwordHash;
        connection.end();

        connection
          .query(
            "SELECT userId FROM Session WHERE userId = (?) and sessionHash = (?)",
            [userId, hashedSession]
          )
          .then((row) => {
            if (!row[0]) {
              res.status(401).send("session not valid");
              connection.end();
              return;
            }
            connection.end();
            connection
              .query("SELECT * FROM Plant WHERE userId = (?) and active = 1", [
                userId,
              ])
              .then((result) => {
                res.status(202).json(result);
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
 * Get all plantDiaryEntries belonging to a plant
 */
function getPlantDiaryEntries(pool, req, res) {
  let plantId = req.body.plantDiaryEntry.plantId || req.body.plantId;
  let username = req.body.username;
  let sessionId = req.body.sessionId;

  pool.getConnection().then((connection) => {
    connection
      .query("SELECT salt, userId FROM User WHERE username = (?)", [username])
      .then((row) => {
        if (!row[0]) {
          res.status(401).send("session not valid");
          conn.end();
          return;
        }
        let salt = row[0].salt;
        let userId = row[0].userId;

        let hashedSession = utility.sha512(sessionId, salt).passwordHash;
        connection.end();

        connection
          .query(
            "SELECT userId FROM Session WHERE userId = (?) and sessionHash = (?)",
            [userId, hashedSession]
          )
          .then((row) => {
            if (!row[0]) {
              res.status(401).send("session not valid");
              connection.end();
              return;
            }
            connection.end();
            // Check if user owns plant
            connection
              .query(
                "SELECT * FROM Plant WHERE userId = (?) and active = 1 and plantId = (?)",
                [userId, plantId]
              )
              .then((result) => {
                if (!result[0] || !result[0].plantId) {
                  res.status(401).send("plant could not be found");
                  connection.end();
                  return;
                }

                connection.end();
                connection
                  .query("SELECT * FROM PlantDiary WHERE plantId = (?)", [
                    plantId,
                  ])
                  .then((result) => {
                    res.status(202).json(result);
                    connection.end();
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(401).send("plant could not be found");
                    connection.end();
                  });
              })
              .catch((err) => {
                console.log(err);
                res.status(401).send("rows could not be found");
                connection.end();
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(401).send("rows could not be found");
            connection.end();
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
 * Create PlantDiary entry
 */
function createPlantDiaryEntry(pool, req, res) {
  let plantDiaryEntry = req.body.plantDiaryEntry;

  if (req.file) {
    plantDiaryEntry.image =
      req.file.path ||
      "https://images.pexels.com/photos/6847584/pexels-photo-6847584.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500";
  } else {
    plantDiaryEntry.image =
      "https://images.pexels.com/photos/6847584/pexels-photo-6847584.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500";
  }

  let username = req.body.username;
  let sessionId = req.body.sessionId;
  let hashedSession;

  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT salt, userId FROM User WHERE username = (?)", [username])
        .then((row) => {
          if (!row[0]) {
            res.status(401).send("session not valid");
            conn.end();
            return;
          }
          let salt = row[0].salt;
          let userId = row[0].userId;

          hashedSession = utility.sha512(sessionId, salt).passwordHash;

          conn.end();
          conn
            .query(
              "SELECT userId FROM Session WHERE userId = (?) and sessionHash = (?)",
              [userId, hashedSession]
            )
            .then((row) => {
              if (!row[0]) {
                res.status(401).send("session not valid");
                conn.end();
                return;
              }
              conn.end();
              // session is valid || userId is set

              // Now check if user owns plant
              conn
                .query(
                  "SELECT * FROM Plant WHERE userId = (?) and active = 1 and plantId = (?)",
                  [userId, plantDiaryEntry.plantId]
                )
                .then((result) => {
                  if (!result[0] || !result[0].plantId) {
                    res.status(401).send("plant could not be found");
                    conn.end();
                    return;
                  }
                  conn.end();

                  // Check if plantdiaryentry exists

                  let dateWithoutTime = new Date(
                    plantDiaryEntry.date.toString()
                  );
                  dateWithoutTime.setHours(0, 0, 0, 0);
                  plantDiaryEntry.date = dateWithoutTime;

                  conn
                    .query(
                      "SELECT * FROM PlantDiary WHERE plantId = (?) AND date = (?)",
                      [plantDiaryEntry.plantId, plantDiaryEntry.date]
                    )
                    .then((result) => {
                      conn.end();
                      if (!result[0] || !result[0].plantDiaryId) {
                        // plantdiaryentry does not exist -> create
                        conn
                          .query(
                            "INSERT INTO PlantDiary (plantId, watered, fertilized, image, date, note, size, health) VALUES (?,?,?,?,?,?,?,?)",
                            [
                              plantDiaryEntry.plantId,
                              plantDiaryEntry.watered,
                              plantDiaryEntry.fertilized,
                              plantDiaryEntry.image,
                              plantDiaryEntry.date,
                              plantDiaryEntry.note,
                              plantDiaryEntry.size,
                              plantDiaryEntry.health,
                            ]
                          )
                          .then((result) => {
                            conn.end();
                            return this.getPlantDiaryEntries(pool, req, res);
                          })
                          .catch((err) => {
                            console.log(err);
                            res.status(401).send("rows could not be created");
                          });
                      } else {
                        // plantdiaryentry does exist -> update
                        conn
                          .query(
                            "UPDATE PlantDiary SET plantId = (?), watered = (?), fertilized = (?), image = (?), date = (?), note = (?), size = (?), health = (?) WHERE plantDiaryId = (?)",
                            [
                              plantDiaryEntry.plantId,
                              plantDiaryEntry.watered,
                              plantDiaryEntry.fertilized,
                              plantDiaryEntry.image,
                              plantDiaryEntry.date,
                              plantDiaryEntry.note,
                              plantDiaryEntry.size,
                              plantDiaryEntry.health,
                              result[0].plantDiaryId,
                            ]
                          )
                          .then((result) => {
                            conn.end();
                            return this.getPlantDiaryEntries(pool, req, res);
                          })
                          .catch((err) => {
                            console.log(err);
                            res.status(401).send("rows could not be created");
                          });
                      }
                    });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(401).send("rows could not be found");
                  connection.end();
                });
            });
        });
    })
    .catch((err) => {
      console.log(err);
      // not connected
    });
}

module.exports = {
  createPlant,
  updatePlant,
  getPlants,
  getPlantDiaryEntries,
  createPlantDiaryEntry,
};

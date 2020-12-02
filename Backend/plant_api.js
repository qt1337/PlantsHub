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
  let image = req.body.image || null;
  let lux = req.body.lux || null;

  pool.getConnection().then((connection) => {
    connection
      .query("SELECT salt FROM User WHERE username = (?)", [username])
      .then((row) => {
        let salt = row[0].salt;

        let hashedSessionId = utility.sha512(sessionId, salt).passwordHash;

        connection
          .query(
            "SELECT userId FROM User WHERE username = (?) and sessionId = (?)",
            [username, hashedSessionId]
          )
          .then((result) => {
            console.log(result[0]);
            let userId = result[0].userId;
            console.log(userId);

            if (result[0].userId) {
              console.log("good");
            }

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
                console.log(result);
                res.status(202).json(result);
                connection.end();
              })
              .catch((err) => {
                console.log(err);
                res.status(401).send("rows could not be created");
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
  });
}

module.exports = {
  createPlant,
};

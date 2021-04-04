const utility = require("./utility");

/**
 * Creates a user
 */
function createUser(pool, req, res) {
  let [salt, hashedPassword] = utility.getSaltHashPassword(req.body.password);

  pool
    .getConnection()
    .then((connection) => {
      connection
        .query(
          "INSERT INTO User(username, email, password, forename, surname, birthday, salt) value (?, ?, ?, ?, ?, ?, ?)",
          [
            req.body.username,
            req.body.email,
            hashedPassword,
            req.body.forename,
            req.body.surname,
            req.body.birthday,
            salt,
          ]
        )
        .then((result) => {
          if (result === 0) {
            return;
          }
          return checkUserCredentials(pool, req, res);
        })
        .catch((err) => {
          console.log(err);
          res.status(401).send("rows could not be created");
          connection.end();
        });
    })
    .catch((err) => {
      console.log(err);
      // not connected
    });
}

/**
 * Check session of user
 */
function checkUserSession(pool, req, res) {
  let username = req.body.username;
  let sessionId = req.body.sessionId;
  let hashedSession;
  let now;

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
          conn.query("SELECT userId FROM Session WHERE userId = (?) and sessionHash = (?)", [userId, hashedSession])
            .then((row) => {
              if (!row[0]) {
                res.status(401).send("session not valid");
                conn.end();
                return;
              }
              conn.end();
              return conn.query(
                "SELECT * FROM User WHERE userId = (?)",
                [userId]
              ).then((result) => {
                if (!result[0]) {
                  res.status(401).send("session not valid");
                  conn.end();
                  return;
                }
                result[0].sessionId = sessionId;
                delete result[0].password;
                delete result[0].salt;
                delete result[0].userId;

                res.status(202).json(result);
                conn.end();
              })
                .catch((err) => {
                  console.log(err);
                  res.status(401).send("session not valid");
                  conn.end();
                });
            })
        })
    })
    .catch((err) => {
      console.log(err);
      // not connected
    });
}

/**
 * Check credentials of user
 */
function checkUserCredentials(pool, req, res) {
  let username = req.body.username;
  let password = req.body.password;
  let sessionId = utility.getRandomString(64);
  let hashedPassword;
  let hashedSession;
  let sessionExpiringDate;

  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT salt FROM User WHERE username = (?) OR email = (?)", [
          username,
          username,
        ])
        .then((row) => {
          let salt = row[0].salt;

          hashedPassword = utility.sha512(password, salt).passwordHash;
          hashedSession = utility.sha512(sessionId, salt).passwordHash;

          let daysUntilExpiring = 7;

          sessionExpiringDate = new Date();
          sessionExpiringDate.setDate(
            sessionExpiringDate.getDate() + daysUntilExpiring
          );
          conn.end();
          conn
            .query("SELECT userId FROM User WHERE (username = (?) OR email = (?)) AND password = (?)", [
              username,
              username,
              hashedPassword
            ])
            .then((row) => {
              if (!row[0]) {
                res.status(404).send("credentials not correct");
                conn.end();
                return;
              }

              let userId = row[0].userId;

              conn.end();
              conn
                // .query(
                //   "UPDATE User SET sessionId = (?), sessionCreated = (?) WHERE ( username = (?) OR email = (?) ) and password = (?)",
                .query("INSERT INTO Session (userId, sessionHash) VALUE (?,?)",
                  [
                    userId,
                    hashedSession,
                  ]
                )
                .then((result) => {
                  console.log(result);
                  if (result["affectedRows"] === 0) {
                    res.clearCookie("sessionData");
                    res.status(404).send("credentials not correct");
                    conn.end();
                    return;
                  }
                  let sessionData = {
                    sessionId: sessionId,
                    username: username,
                  };
                  res.clearCookie("sessionData");
                  res.cookie("sessionData", sessionData, {
                    maxAge: 6048000,
                    secure: true,
                    sameSite: "strict",
                  });
                  conn.end();
                  return conn
                    .query(
                      "SELECT * FROM User WHERE ( username = (?) OR email = (?) ) and password = (?)",
                      [username, username, hashedPassword]
                    )
                    .then((result) => {
                      result[0].sessionId = sessionId;
                      delete result[0].password;
                      delete result[0].salt;
                      delete result[0].userId;

                      res.status(202).json(result);
                      console.log(result[0].username + " logged in.");
                      conn.end();
                    })
                    .catch((err) => {
                      console.log(err);
                      res.status(400).send("error occurred");
                      conn.end();
                    });
                });
            })
            .catch((err) => {
              console.log(err);
              res.status(404).send("credentials not correct");
              conn.end();
            });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send("credentials not correct");
    });
}

module.exports = {
  createUser,
  checkUserCredentials,
  checkUserSession,
};

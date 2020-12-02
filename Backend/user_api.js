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
  if (
    typeof req.cookies.sessionData === "undefined" ||
    typeof req.cookies.sessionData.username === "undefined" ||
    req.cookies.sessionData.sessionId === "undefined"
  ) {
    res.status(401).send("no active session");
    return;
  }
  let username = req.cookies.sessionData.username;
  let sessionId = req.cookies.sessionData.sessionId;
  let hashedSessionId;

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

          hashedSessionId = utility.sha512(sessionId, salt).passwordHash;
          conn.end();
          return conn.query(
            "SELECT * FROM User WHERE ( username = (?) OR email = (?) ) and sessionId = (?)",
            [username, username, hashedSessionId]
          );
        })
        .then((result) => {
          if (result[0]["username"] === username) {
            res.status(202).send("sessionId correct");
          } else {
            res.status(401).send("sessionId not correct");
          }
          conn.end();
        })
        .catch((err) => {
          console.log(err);
          res.status(401).send("sessionId not correct");
          conn.end();
        });
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
  let hashedSessionId;

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
          hashedSessionId = utility.sha512(sessionId, salt).passwordHash;

          conn
            .query(
              "UPDATE User SET sessionId = (?) WHERE ( username = (?) OR email = (?) ) and password = (?)",
              [hashedSessionId, username, username, hashedPassword]
            )
            .then((result) => {
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

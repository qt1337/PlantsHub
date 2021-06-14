const utility = require("./utility");

/**
 * Updates User Information
 */

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
 * Updates information of user
 */
function updateUser(pool, req, res) {
  let hashedSessionId;

  let username = req.body.username;
  let sessionId = req.body.sessionId;

  let newUsername = req.body.newUsername || null;
  let newEmail = req.body.newEmail || null;
  let newForename = req.body.newForename || null;
  let newSurname = req.body.newSurname || null;
  let newBirthday = req.body.newBirthday || null;

  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT salt, userId FROM User WHERE username = (?)", [username])
        .then((row) => {
          if (!row[0]) {
            res.status(404).send("user does not exist");
            conn.end();
            return;
          }
          let salt = row[0].salt;
          let userId = row[0].userId;
          hashedSessionId = utility.sha512(sessionId, salt).passwordHash;

          conn.end();
          conn
            .query(
              "SELECT userId FROM Session WHERE userId = (?) and sessionHash = (?)",
              [userId, hashedSessionId]
            )
            .then((row) => {
              if (!row[0]) {
                res.status(401).send("session not valid");
                conn.end();
                return;
              }
              conn.end();
              // session is valid || userId is set

              conn
                .query(
                  "UPDATE User SET username =  COALESCE((?),username), email = COALESCE((?), email), forename = COALESCE((?), forename), surname = COALESCE((?), surname), birthday = COALESCE((?), birthday) WHERE userId = (?)",
                  [
                    newUsername,
                    newEmail,
                    newForename,
                    newSurname,
                    newBirthday,
                    userId,
                  ]
                )
                .then((result) => {
                  if (result.affectedRows !== 1) {
                    res.status(401).send("something went wrong");
                    conn.end();
                    return;
                  }
                  conn.end();

                  req.body.username = newUsername || username;

                  return checkUserSession(pool, req, res);
                });
            });
        });
    })
    .catch((err) => {
      console.log(err);
      // not connected
    });
}

/**
 * Delete user
 */
function deleteUser(pool, req, res) {
  let hashedSessionId;

  let username = req.body.username;
  let sessionId = req.body.sessionId;

  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT salt, userId FROM User WHERE username = (?)", [username])
        .then((row) => {
          if (!row[0]) {
            res.status(404).send("user does not exist");
            conn.end();
            return;
          }
          let salt = row[0].salt;
          let userId = row[0].userId;
          hashedSessionId = utility.sha512(sessionId, salt).passwordHash;

          conn.end();
          conn
            .query(
              "SELECT userId FROM Session WHERE userId = (?) and sessionHash = (?)",
              [userId, hashedSessionId]
            )
            .then((row) => {
              if (!row[0]) {
                res.status(401).send("session not valid");
                conn.end();
                return;
              }
              conn.end();
              // session is valid || userId is set

              conn
                .query("DELETE FROM User WHERE userId = (?)", [userId])
                .then((result) => {
                  if (result.affectedRows !== 1) {
                    res.status(401).send("something went wrong");
                    conn.end();
                    return;
                  }

                  res.status(202).json("user has been deleted");
                  conn.end();
                });
            });
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

  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT salt, userId FROM User WHERE username = (?)", [username])
        .then((row) => {
          if (!row || !row[0]) {
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
              if (!row || !row[0]) {
                res.status(401).send("session not valid");
                conn.end();
                return;
              }
              conn.end();
              return conn
                .query("SELECT * FROM User WHERE userId = (?)", [userId])
                .then((result) => {
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
            });
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
          if (!row || !row[0]) {
            res.status(401).send("credentials not correct");
            conn.end();
            return;
          }
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
            .query(
              "SELECT userId FROM User WHERE (username = (?) OR email = (?)) AND password = (?)",
              [username, username, hashedPassword]
            )
            .then((row) => {
              if (!row[0]) {
                res.status(401).send("credentials not correct");
                conn.end();
                return;
              }

              let userId = row[0].userId;

              conn.end();
              conn
                // .query(
                //   "UPDATE User SET sessionId = (?), sessionCreated =
                //   (?) WHERE ( username = (?) OR email = (?) ) and
                //   password = (?)",
                .query(
                  "INSERT INTO Session (userId, sessionHash) VALUE (?,?)",
                  [userId, hashedSession]
                )
                .then((result) => {
                  console.log(result);
                  if (result["affectedRows"] === 0) {
                    res.clearCookie("sessionData");
                    res.status(401).send("credentials not correct");
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
                      delete result[0].resetPasswordKey;
                      delete result[0].resetPasswordDate;
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
              res.status(401).send("credentials not correct");
              conn.end();
            });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send("credentials not correct");
    });
}

/**
 * For resetting password of user
 * Creates key and saves hashed key in database
 * Sends unhashed key via email to user
 * Key lasts 30 minutes until invalid
 */
function requestResetPasswordKey(pool, req, res) {
  let email = req.body.email;
  let resetPasswordKey = utility.getRandomString(64);

  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT salt, userId FROM User WHERE email = (?)", [email])
        .then((row) => {
          if (!row[0]) {
            res.status(404).send("user does not exist");
            conn.end();
            return;
          }
          let salt = row[0].salt;
          let userId = row[0].userId;
          let hashedResetPasswordKey = utility.sha512(resetPasswordKey, salt)
            .passwordHash;
          let currentDate = new Date();
          let resetPasswordDate = new Date(currentDate.getTime() + 30 * 60000);

          conn.end();
          conn
            .query(
              "UPDATE User SET resetPasswordKey = (?), resetPasswordDate = (?) WHERE userId = (?)",
              [hashedResetPasswordKey, resetPasswordDate, userId]
            )
            .then((result) => {
              if (result.affectedRows !== 1) {
                res.status(401).send("something went wrong");
                conn.end();
                return;
              }
              console.log(resetPasswordKey); // TODO
              // sendResetPasswordEmail(resetPasswordKey);
              res.status(202).json("email has been sent");
              conn.end();
            });
        });
    })
    .catch((err) => {
      console.log(err);
      // not connected
    });
}

/**
 * For resetting password of user
 * Checks if key is valid and before resetPasswordDate
 * Changes password of user
 */
function resetPasswordKey(pool, req, res) {
  let email = req.body.email || null;
  let resetPasswordKey = req.body.resetPasswordKey || null;
  let password = req.body.password || null;

  if (!email || !resetPasswordKey || !password) {
    res.status(401).send("something went wrong");
    return;
  }

  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT salt, userId FROM User WHERE email = (?)", [email])
        .then((row) => {
          if (!row[0]) {
            res.status(404).send("user does not exist");
            conn.end();
            return;
          }
          let userId = row[0].userId;
          let salt = row[0].salt;
          let hashedResetPasswordKey = utility.sha512(resetPasswordKey, salt)
            .passwordHash;
          let hashedPassword = utility.sha512(password, salt).passwordHash;

          conn.end();
          conn
            .query(
              "UPDATE User SET password = (?), resetPasswordKey = null, resetPasswordDate = NOW() WHERE userId = (?) and resetPasswordKey = (?) and resetPasswordDate > NOW()",
              [hashedPassword, userId, hashedResetPasswordKey]
            )
            .then((result) => {
              if (result.affectedRows !== 1) {
                res.status(401).send("resetPasswordKey is not valid anymore");
                conn.end();
                return;
              }
              res.status(202).json("password has been changed"); // TODO route to login
              // page
              conn.end();
            });
        });
    })
    .catch((err) => {
      console.log(err);
      // not connected
    });
}

module.exports = {
  createUser,
  checkUserCredentials,
  checkUserSession,
  requestResetPasswordKey,
  resetPasswordKey,
  updateUser,
  deleteUser,
};

/**
 template for checking session of user

 function checkUserSession(pool, req, res) {
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
              "SELECT userId FROM Session WHERE userId = (?) and sessionHash =
(?)", [userId, hashedSession]
            )
            .then((row) => {
              if (!row[0]) {
                res.status(401).send("session not valid");
                conn.end();
                return;
              }
              conn.end();

              // session is valid || userId is set

            });
        });
    })
    .catch((err) => {
      console.log(err);
      // not connected
    });
}

 */

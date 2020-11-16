const crypto = require("crypto");

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
function getRandomString(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
function sha512(password, salt) {
  let hash = crypto.createHmac("sha512", salt);
  /** Hashing algorithm sha512 */
  hash.update(password);
  let value = hash.digest("hex");
  return {salt: salt, passwordHash: value};
}

/**
 * hash password with sha512 and adds salt.
 * @param password
 * @returns {string} hashed password
 */
function getSaltHashPassword(password) {
  let salt = getRandomString(16);
  let passwordData = sha512(password, salt);
  return [salt, passwordData.passwordHash];
}

/**
 * Creates a dummy item
 */
function createItem(pool, req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT 1 as val")
        .then((rows) => {
          console.log(rows);
          return conn.query("INSERT INTO myTable value (?, ?)", [
            req.params.item_id,
            req.params.item_name,
          ]);
        })
        .then((result) => {
          res.status(202).send("rows have been created");
          console.log(result);
          conn.end();
        })
        .catch((err) => {
          console.log(err);
          res.status(401).send("rows could not be created");
          conn.end();
        });
    })
    .catch((err) => {
      console.log(err);
      // not connected
    });
}

/**
 * Creates a user
 */
function createUser(pool, req, res) {
  let [salt, hashedPassword] = getSaltHashPassword(req.body.password);

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

          hashedSessionId = sha512(sessionId, salt).passwordHash;

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
  let sessionId = getRandomString(64);
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

          hashedPassword = sha512(password, salt).passwordHash;
          hashedSessionId = sha512(sessionId, salt).passwordHash;

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
              res.cookie("sessionData", sessionData,
                {
                  maxAge: 604800,
                  secure: true,
                  sameSite: "strict"
                }
              );
              return conn
                .query(
                  "SELECT * FROM User WHERE ( username = (?) OR email = (?) ) and password = (?)",
                  [username, username, hashedPassword]
                )
                .then((result) => {
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
      conn.end();
    });
}

module.exports = {
  createItem,
  createUser,
  checkUserCredentials,
  checkUserSession,
};

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
  let [salt, hashedPassword] = getSaltHashPassword(req.query.user_password);

  pool
    .getConnection()
    .then((connection) => {
      connection
        .query(
          "INSERT INTO User(username, email, password, forename, surname, birthday, salt) value (?, ?, ?, ?, ?, ?, ?)",
          [
            req.query.user_username,
            req.query.user_email,
            hashedPassword,
            req.query.user_forename,
            req.query.user_surname,
            req.query.user_birthday,
            salt,
          ]
        )
        .then((result) => {
          res.status(202).send("rows have been created");
          console.log(result);
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
      // not connected
    });
}

/**
 * Check session of user
 */
function checkUserSession(pool, req, res) {
  if (typeof req.cookies.sessionData === 'undefined' || typeof req.cookies.sessionData.account === 'undefined' || req.cookies.sessionData.sessionId === 'undefined') {
    res.status(401).send('no active session');
    return;
  }
  let account = req.cookies.sessionData.account;
  let sessionId = req.cookies.sessionData.sessionId;
  let hashedSessionId;

  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT salt FROM User WHERE username = (?) OR email = (?)", [
          account,
          account,
        ])
        .then((row) => {
          let salt = row[0].salt;

          hashedSessionId = sha512(sessionId, salt).passwordHash;

          return conn.query(
            "SELECT * FROM User WHERE ( username = (?) OR email = (?) ) and sessionId = (?)",
            [account, account, hashedSessionId]
          );
        })
        .then((result) => {
          console.log(result[0]['username'] === account);
          if (result[0]['username'] === account) {
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
  let account = req.body.account;
  let password = req.body.password;
  let sessionId = getRandomString(64);
  let hashedPassword;
  let hashedSessionId;

  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT salt FROM User WHERE username = (?) OR email = (?)", [
          account,
          account,
        ])
        .then((row) => {
          let salt = row[0].salt;

          hashedPassword = sha512(password, salt).passwordHash;
          hashedSessionId = sha512(sessionId, salt).passwordHash;

          return conn.query(
            "UPDATE User SET sessionId = (?) WHERE ( username = (?) OR email = (?) ) and password = (?)",
            [hashedSessionId, account, account, hashedPassword]
          );
        })
        .then((result) => {
          console.log(result['affectedRows']);
          if (result['affectedRows'] !== 1) {
            res.clearCookie("sessionData");
            res.status(401).send();
            conn.end();
            return;
          }
          let sessionData = {
            sessionId: sessionId,
            account: account,
          };
          res.clearCookie("sessionData");
          res.cookie("sessionData", sessionData, {maxAge: 604800});
          res.status(202).send();
          conn.end();
        })
        .catch((err) => {
          console.log(err);
          res.status(401).send("credentials not correct");
          conn.end();
        });
    })
    .catch((err) => {
      console.log(err);
      // not connected
    });
}

module.exports = {
  createItem,
  createUser,
  checkUserCredentials,
  checkUserSession,
};

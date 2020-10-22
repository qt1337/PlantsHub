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
  return { salt: salt, passwordHash: value };
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
        .then((resp) => {
          res.status(200).send("rows have been created");
          console.log(resp);
          conn.end();
        })
        .catch((err) => {
          console.log(err);
          res.status(200).send("rows could not be created");
          conn.end();
        });
    })
    .catch((err) => {
      console.log(err);
      // not connected
    });
}

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
        .then((resp) => {
          res.status(200).send("rows have been created");
          console.log(resp);
          connection.end();
        })
        .catch((err) => {
          console.log(err);
          res.status(200).send("rows could not be created");
          connection.end();
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
};

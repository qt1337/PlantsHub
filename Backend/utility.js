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
 * @returns {(*|string)[]} hashed password
 */
function getSaltHashPassword(password) {
  let salt = getRandomString(16);
  let passwordData = sha512(password, salt);
  return [salt, passwordData.passwordHash];
}

module.exports = {
  getRandomString,
  sha512,
  getSaltHashPassword,
};

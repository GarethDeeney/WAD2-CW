const bcrypt = require("bcrypt");
const userModel = require("../models/loginModel");
const jwt = require("jsonwebtoken");

/**
 * logs in a user by checking username and password against the database
 * @returns http 401 status code if user is  not found
 * @returns http 403 if login details are incorrect
 * @returns void if successful
 */
exports.login = (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  // check if user exists in the database
  userModel.lookup(username, (err, user) => {
    // return 401 is an error occurs
    if (err) {
      console.log("error looking up user", err);
      return res.status(401).send();
    }

    // return 401 if user isn't found
    if (!user) {
      console.log("user ", username, " not found");
      return res.status(401).send();
    }

    //compare provided password with stored password
    bcrypt.compare(password, user.password, (err, result) => {

      if (result) {
        // set cookie if log in successful
        let payload = { username: user.username };
        let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
        res.cookie("jwt", accessToken);
        next();
      } else {
        // return forbidden if not.
        return res.status(403).send();
      }
    });
  });
};

/**
 * verifies a user is logged in before accessing a route.
 * @returns http 401 status code if user is  not found
 * @returns http 403 if login details are incorrect
 * @returns void if successful
 */
exports.verify = (req, res, next) => {
  let accessToken = req.cookies.jwt;

  if (!accessToken) {
    return res.status(403).send();
  }

  let payload;

  try {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (err) {
    res.status(401).send();
  }
};

/**
 * checks user is logged in.
 * @returns false if not token is passed
 * @returns true is access token passes verify check.
 */
exports.is_logged_in = (accessToken) => {
  return !accessToken
    ? false
    : !!jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
};

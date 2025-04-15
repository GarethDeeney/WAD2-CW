const { is_logged_in } = require("../auth/auth");
const userModel = require("../models/loginModel");

/**
 * Method to renders login mustache template if promises is resolve
 */
exports.show_login_page = (req, res) => {
  res.render("login");
};

/**
 * Method that handles login.
 */
exports.handle_login = (req, res) => {
  res.render("landingPage", {
    title: "Login",
    user: "user",
  });
};

/**
 * Method that renders users table.
 */
exports.users_table = (req, res) => {
  userModel.getAllUsers().then((users) => {
    res.render("usersTable", {
      title: "Users",
      users: users,
      user: is_logged_in(req.cookies.jwt),
    });
  });
};

/**
 * Method that renders remove user page.
 */
exports.remove_user = (req, res) => {
  res.render("removeUser", {
    title: "Remove User",
    user: is_logged_in(req.cookies.jwt),
  });
};

/**
 * Method that renders users table.
 */
exports.handle_remove_user = (req, res) => {
  userModel
    .removeUser(req.body.username)
    .then((numRemoved) => {
      res.status(204).redirect("../users");
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

/**
 * Method that renders create user page.
 */
exports.create_user = (req, res) => {
  res.render("addUser", {
    title: "Create User",
    user: is_logged_in(req.cookies.jwt),
  });
};

/**
 * Method that handles creating a user.
 */
exports.handle_create_user = (req, res) => {
  userModel
    .createUser(req.body)
    .then((newUser) => {
      res.status(201).redirect("../users");
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

/**
 * Method that logs out a user.
 */ exports.logout = (req, res) => {
  res.clearCookie("jwt").status(200).redirect("/");
};

const nedb = require("gray-nedb");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class UserDAO {
  constructor(dbFilePath) {
    if (dbFilePath) {
      this.db = new nedb({ filename: dbFilePath, autoload: true });
    } else {
      this.db = new nedb();
    }
  }

  /**
   * Checks for user in the database.
   * @param user user to check for.
   * @param callBack call back function for result.
   * @returns {Promise}
   */
  lookup = (user, callBack) => {
    this.db.find({ username: user }, (err, entries) => {
      return err || entries.length == 0
        ? callBack(null, null)
        : callBack(null, entries[0]);
    });
  };

  /**
   * returns all users in database sorted by surname.
   * @returns {Promise}
   */
  getAllUsers = () => {
    return new Promise((resolve, reject) => {
      this.db
        .find({})
        .sort({ surname: 1 })
        .exec((err, users) => {
          err ? reject(err) : resolve(users);
        });
    });
  };

  /**
   * removes a user from the database.
   * @returns {Promise}
   */
  removeUser = (username) => {
    return new Promise((resolve, reject) => {
      this.db.remove({ username: username }, (err, numRemoved) => {
        err ? reject(err) : resolve(numRemoved);
      });
    });
  };

  /**
   * Adds new user to the database.
   * @param user new user.
   * @returns {Promise}
   */
  createUser = (user) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(user.password, saltRounds).then((hash) => {
        const hashedUser = { ...user, password: hash };
        this.db.insert(hashedUser, (err, newUser) => {
          err ? reject(err) : resolve(newUser);
        });
      });
    });
  };

  init() {
    this.db.insert({
      username: "admin",
      password: "$2a$10$q9otP2gPVrkEYMyrvG29..M7jzOS3n9.UnQ/xcobPHkZ2weXsT./O",
      forename: "admin",
      surname: "admin",
      email: "admin@dance-institute.com",
    });

    this.db.insert({
      username: "annsmith1",
      password: "$2y$10$R6y2krts9IczLXgJfTsvwOF9sx7ihLOoQENoLWoqTNvwEbmtI1uga",
      forename: "Ann",
      surname: "Smith",
      email: "ann.smith@dance-institute.com",
    });

    this.db.insert({
      username: "pauljones1",
      password: "$2y$10$cEp7CFZTbE8qHMiId5bD1uL8b9JGR0ahce.2YMhFasOjB6X5Hs3E2",
      forename: "Paul",
      surname: "Jones",
      email: "paul.jones@dance-institute.com",
    });

    return this;
  }
}

const dao = new UserDAO();
dao.init();
module.exports = dao;

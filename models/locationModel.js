const nedb = require("gray-nedb");

class Location {
  /**
   * Class constructor which creates an instance of the database either in memory or in embedded mode.
   * @param dbFilePath optional parameter which is used to create database in embedded mode.
   */
  constructor(dbFilePath) {
    if (dbFilePath) {
      // create instance in embedded mode
      this.db = new nedb({ filename: dbFilePath, autoLoad: true });
      console.log("Db connnected to " + dbFilePath);
    } else {
      // create instance in memory
      this.db = new nedb();
    }
  }

  /**
   * Retrieves all locations from the database.
   * @returns {Promise}
   */
  getAllLocations() {
    return new Promise((resolve, reject) => {
      this.db.find({}).exec((err, locations) => {
        if (err) {
          reject(err);
        } else {
          resolve(locations);
        }
      });
    });
  }

  /**
   * Adds data to database, used when creating the instance.
   */
  init() {
    locations.forEach((location) => {
      this.db.insert(location);
    });
  }
}

module.exports = Location;


const locations = [
  {
    name: "London",
    description:
      "Located in the Coleridge Gardens in the English Ballet School, our London dance school specialises in Ballet.",
    imagePath: "./images/london.jpg",
    email: "london@danceinstitute.com",
    telephone: "020 7924 3400",
  },
  {
    name: "Glasgow",
    description:
      "Based in the Scottish Ballet in Glasgow, our school offers a wide range of courses at every level.",
    imagePath: "./images/glasgow.jpg",
    email: "glasgow@danceinstitute.com",
    telephone: "0141 339 7711",
  },
  {
    name: "Edinburgh",
    description:
      "Located within the GrassMarket, our Edinburgh dance school offers a wide range of courses at every level.",
    imagePath: "./images/edinburgh.jpg",
    email: "edinburgh@danceinstitute.com",
    telephone: "0131 447 1313",
  },
];
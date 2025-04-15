const nedb = require("gray-nedb");

class Enquiry {
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
   * Retrieves all enquiries from the database.
   * @returns {Promise}
   */
  getAllEnquiries = () => {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, enquiries) => {
        if (err) {
          reject(err);
        } else {
          resolve(enquiries);
        }
      });
    });
  };

  /**
   * adds enquiry to the database.
   * @returns {Promise}
   */
  addEnquiry = (enquiry) => {
    return new Promise((resolve, reject) => {
      const now = new Date();
      const newEnquiry = { ...enquiry, date: now.toISOString().split("T")[0] };
      this.db.insert(newEnquiry, (err, newEnquiry) => {
        err ? rejects(err) : resolve(newEnquiry);
      });
    });
  };

  /**
   *
   * Adds data to database, used when creating the instance.
   */
  init() {
    enquiries.forEach((enquiry) => {
      this.db.insert(enquiry);
    });
  }
}

module.exports = Enquiry;

const enquiries = [
  {
    name: "test enquiry",
    email: "test@enquiry.com",
    message: "This is a test enquiry",
    date: "2025-04-06",
  },
];

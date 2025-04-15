const enquiryDAO = require("../models/enquiryModel");
const { is_logged_in } = require("../auth/auth");

// Create new instance of database.
const db = new enquiryDAO();

// Initialise the database and populate with courses.
db.init();

/**
 * Method that retrieves enquiries from the database.
 * handles promise returned from getAllEnquiriess
 * renders viewEnquiries mustache template if promises is resolved
 * logs error to console if promise is rejected
 */
exports.all_enquiries = (req, res) => {
  db.getAllEnquiries()
    .then((enquiries) => {
      res.render("viewEnquiries", {
        title: "Enquiries",
        enquiries: enquiries,
        user: is_logged_in(req.cookies.jwt),
      });
    })
    .catch((err) => {
      console.log("Promise rejected", err);
    });
};

/**
 * Method that adds and enquiry to the database.
 * handles promise returned from addEnquiry
 * renders viewEnquiries mustache template if promises is resolved
 * logs error to console if promise is rejected
 */
exports.send_enquiry = (req, res) => {
  db.addEnquiry(req.body)
    .then((newEnquiry) => {
      res.status(201).redirect("../about");
    })
    .catch((err) => {
      console.log("Promise rejected", err);
    });
};

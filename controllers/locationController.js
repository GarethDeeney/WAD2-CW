const locationDAO = require("../models/locationModel");
const { updateNameToUpperCase } = require("../utils/helper-functions");
const { is_logged_in } = require("../auth/auth");

// Create new instance of database.
const db = new locationDAO();

// Initialise the database and populate with courses.
db.init();

/**
 * Method that retrieves locations from the database.
 * handles promise returned from getAllLocations
 * updates course names to uppercase using helper function
 * renders aboutUsPage mustache template if promises is resolved
 * logs error to console if promise is rejected
 */
exports.all_locations = (req, res) => {
  db.getAllLocations()
    .then((locations) => {
      const locationUpper = updateNameToUpperCase(locations);
      res.render("aboutUsPage", {
        title: "Locations",
        locations: locationUpper, 
        user: is_logged_in(req.cookies.jwt),
      });
    })
    .catch((err) => {
      console.log("Promise rejected", err);
    });
};


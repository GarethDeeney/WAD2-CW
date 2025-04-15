const courseDAO = require("../models/courseModel");
const { is_logged_in } = require("../auth/auth");

// Create new instance of database.
const db = new courseDAO();

// Initialise the database and populate with courses.
db.init();

/**
 * Method that retrieves courses from the database.
 * handles promise returned from getAllCourses.
 * splits courses by locations.
 * renders coursePage mustache template if promises is resolved.
 * logs error to console if promise is rejected.
 */
exports.all_courses = (req, res) => {
  db.getAllCourses()
    .then((courseList) => {
      const coursesSplitByLocation = {
        london: getCourseByLocation("london", courseList),
        glasgow: getCourseByLocation("glasgow", courseList),
        edinburgh: getCourseByLocation("edinburgh", courseList),
      };

      res.render("coursesPage", {
        title: "Course List",
        londonCourses: coursesSplitByLocation.london,
        glasgowCourses: coursesSplitByLocation.glasgow,
        edinburghCourses: coursesSplitByLocation.edinburgh,
        user: is_logged_in(req.cookies.jwt),
      });
    })
    .catch((err) => {
      console.log("Promise rejected", err);
    });
};

/**
 * Method that retrieves course information from the database.
 * handles promise returned from getCourseInfo
 * renders courseInfoPage mustache template if promises is resolve
 * logs error to console if promise is rejected
 */
exports.course_info = (req, res) => {
  db.getCourseInfo(req.params.id)
    .then((course) => {
      res.render("courseInfoPage", {
        title: "Course Information",
        course: course,
        user: is_logged_in(req.cookies.jwt),
      });
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

/**
 * Method that retrieves all participants of a specific course
 * handles promise returned from getCourseInfo
 * renders classList mustache template if promises is resolve
 * logs error to console if promise is rejected
 */
exports.generate_class_list = (req, res) => {
  db.getCourseInfo(req.params.id)
    .then((course) => {
      res.render("classList", {
        title: `${course[0].name} Class List`,
        course: course,
        user: is_logged_in(req.cookies.jwt),
      });
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

/**
 * Method that removes a participant from a course
 * handles promise returned from removeFromClassList
 * renders classList mustache template if promises is resolve
 * logs error to console if promise is rejected
 */
exports.remove_from_class_list = (req, res) => {
  const participant = req.body.email;
  db.removeFromClassList(req.params.id, participant)
    .then(() => {
      res.redirect(`/courses/${req.params.id}/class-list`);
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

/**
 * Method that enrolls a participant on a specific course
 * returns 400 if no forename, surname or email is provided
 * handles promise returned from getCourseInfo for rendering with course details
 * handles promise returned from enrollOnCourse
 * renders successfulEnroll mustache template if promises is resolve
 * logs error to console if promise is rejected
 */
exports.enroll_on_course = (req, res) => {
  const body = req.body;
  if (!body.forename) {
    res.status(400).send("You must add your forename to enroll.");
    return;
  }

  if (!body.surname) {
    res.status(400).send("You must add your surname to enroll.");
    return;
  }

  if (!body.email) {
    res.status(400).send("You must add your email to enroll.");
    return;
  }

  db.getCourseInfo(req.params.id)
    .then((course) => {
      db.enrollOnCourse(req.params.id, body.forename, body.surname, body.email)
        .then((result) => {
          res.render("successfulEnroll", {
            Title: "Enroll Successful",
            course: course,
            user: is_logged_in(req.cookies.jwt),
          });
        })
        .catch((err) => {
          console.log("promise rejected", err);
        });
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

/**
 * Method that updates or deletes a course
 * Checks which button has been selected by action
 * handles promises and redirects to courses page once complete.
 * logs error to console if promise is rejected
 */
exports.update_course = (req, res) => {
  if (req.body.action == "Delete") {
    db.deleteCourseById(req.params.id)
      .then((numDeleted) => {
        console.log(`${req.body.name} Deleted`);
        res.status(204).redirect("../courses");
      })
      .catch((err) => {
        console.log("promise rejected", err);
      });
  } else {
    db.updateCourse(req.params.id, req.body)
      .then((result) => {
        console.log(`${req.body.name} updated successfully`);
        res.status(204).redirect("../courses");
      })
      .catch((err) => {
        console.log("promise rejected", err);
      });
  }
};

/**
 * Method that adds a new course
 * handles promise returned from addCourse method
 * redirects to courses page once complete
 * logs error to console if promise is rejected
 */
exports.handle_create_course = (req, res) => {
  db.addCourse(req.body)
    .then((course) => {
      console.log(`${req.body.name} created successfully`);
      res.status(201).redirect("../courses");
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

/**
 * Method that renders the add new course form
 */
exports.new_course = (req, res) => {
  res.render("addCourseForm", { title: "Create Course", user: is_logged_in(req.cookies.jwt) });
};

/**
 * Helper function to split courses by location.
 * @param location the location to split courses by.
 * @param courseArr the original array of courses.
 * @returns {Array} array of courses for the specified location.
 */
const getCourseByLocation = (location, courseArr) =>
  courseArr.filter((course) => course.location.toLowerCase() == location);

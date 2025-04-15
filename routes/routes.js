const express = require("express");

const router = express.Router();
const courseController = require("../controllers/courseController");
const locationController = require("../controllers/locationController");
const enquiryController = require("../controllers/enquiryController");

const loginController = require("../controllers/loginController");
const { login, verify, is_logged_in } = require("../auth/auth");

// landing page
router.get("/", (req, res) => {
  res.render("landingPage", { user: is_logged_in(req.cookies.jwt), title: "Dance Institute" });
});

// login route
router.post("/login", login, loginController.handle_login);
router.get("/logout", verify, loginController.logout);
router.get("/users", verify, loginController.users_table);
router.get("/users/remove", verify, loginController.remove_user);
router.post("/users/remove", verify, loginController.handle_remove_user);
router.get("/users/create", verify, loginController.create_user);
router.post("/users/create", verify, loginController.handle_create_user);

// course routes list
router.get("/courses", courseController.all_courses);
router.get("/courses/create", verify, courseController.new_course);
router.post("/courses/create", verify, courseController.handle_create_course);
router.get("/courses/:id", courseController.course_info);
router.get(
  "/courses/:id/class-list",
  verify,
  courseController.generate_class_list
);
router.post(
  "/courses/:id/class-list/remove",
  verify,
  courseController.remove_from_class_list
);

router.post("/enroll/:id", courseController.enroll_on_course);
router.post("/course/:id", verify, courseController.update_course);

// locations page
router.get("/about", locationController.all_locations);
router.post("/enquiry", enquiryController.send_enquiry);
router.get("/enquiries", verify, enquiryController.all_enquiries);

// login page
router.get("/login", loginController.show_login_page);

router.use((req, res) => {
  res.status(404);
  res.type("text/plain");
  res.send("404 Not found.");
});

router.use((req, res, next) => {
  res.status(500);
  res.type("text/plain");
  res.send("Internal Server Error.");
});

module.exports = router;

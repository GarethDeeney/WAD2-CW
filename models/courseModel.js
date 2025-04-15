const nedb = require("gray-nedb");
const { mockCourses } = require("./mockCourse");

class Course {
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
   * Retrieves all courses from the database.
   * Sorted alphabetically by name.
   * @returns {Promise}
   */
  getAllCourses = () => {
    return new Promise((resolve, reject) => {
      this.db
        .find({})
        .sort({ type: 1, level: 1 })
        .exec((err, courses) => {
          if (err) {
            reject(err);
          } else {
            resolve(courses);
          }
        });
    });
  };

  /**
   * Retrieves a single courses information from the database.
   * @param courseId the id of the course to fetch.
   * @returns {Promise}
   */
  getCourseInfo = (courseId) => {
    return new Promise((resolve, reject) => {
      this.db.find({ _id: courseId }, (err, course) => {
        err ? reject(err) : resolve(course);
      });
    });
  };

  removeFromClassList = (courseId, participant) => {
    return this.getCourseInfo(courseId).then((course) => {
      return new Promise((resolve, reject) => {
       const participants = course[0].participants.filter(
          (p) => p.email != participant
        );
        this.db.update(
          { _id: courseId },
          { $set: { participants: participants } },
          (err, updates) => {
            err ? reject(err) : resolve(updates);
          }
        );
      });
    });
  };
  /**
   * Adds participant to course.
   * @param courseId the id of the course to add participant to.
   * @param firstname participant forename
   * @param lastname participant surname
   * @param email participant email
   * @returns {Promise}
   */
  enrollOnCourse = (courseId, firstname, lastname, email) => {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: courseId },
        {
          $addToSet: {
            participants: {
              firstName: firstname,
              lastName: lastname,
              email: email,
            },
          },
        },
        (err, numUpdated) => {
          err ? reject(err) : resolve(numUpdated);
        }
      );
    });
  };

  /**
   * Deletes course from database.
   * @param courseId the id of the course to delete.
   * @returns {Promise}
   */
  deleteCourseById = (courseId) => {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: courseId }, (err, numRemoved) => {
        err ? reject(err) : resolve(numRemoved);
      });
    });
  };

  /**
   * Updates course from database.
   * @param courseId the id of the course to update.
   * @param course updated course.
   * @returns {Promise}
   */
  updateCourse = (courseId, course) => {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: courseId },
        {
          $set: {
            name: course.name,
            description: course.description,
            startDate: course.startDate,
            duration: course.duration,
            startTime: course.startTime,
            endTime: course.endTime,
            price: course.price,
            location: course.location,
          },
        },
        (err, numUpdated) => {
          err ? reject(err) : resolve(numUpdated);
        }
      );
    });
  };

  /**
   * Add new course to the database.
   * @param course new course.
   * @returns {Promise}
   */
  addCourse = (course) => {
    return new Promise((resolve, reject) => {
      this.db.insert(course, (err, newCourse) => {
        err ? rejects(err) : resolve(newCourse);
      });
    });
  };

  /**
   * Adds data to database, used when creating the instance.
   */
  init() {
    courses.forEach((course) => {
      this.db.insert(course);
    });
  }
}

const courses = mockCourses;
module.exports = Course;

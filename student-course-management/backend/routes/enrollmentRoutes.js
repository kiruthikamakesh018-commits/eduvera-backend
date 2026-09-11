const express = require("express");

const router = express.Router();

const {
  enrollCourse,
  getMyCourses,
  getRegisteredStudents
} = require("../controllers/enrollmentController");


// Enroll in a course
router.post("/", enrollCourse);


// Get student's enrolled courses
router.get(
  "/student/:studentId",
  getMyCourses
);


// Get all registered students
router.get(
  "/students",
  getRegisteredStudents
);

console.log("Enrollment routes loaded");

module.exports = router;
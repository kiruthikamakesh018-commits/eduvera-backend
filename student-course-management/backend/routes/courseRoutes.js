const express = require("express");

const router = express.Router();

const {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");


// Add Course
router.post("/", createCourse);

// Get Courses
router.get("/", getCourses);

// Update Course
router.put("/:id", updateCourse);

// Delete Course
router.delete("/:id", deleteCourse);


module.exports = router;
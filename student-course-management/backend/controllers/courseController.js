const Course = require("../models/Course");

// =========================
// ADD COURSE
// =========================
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      instructor,
      duration
    } = req.body;

    const course = await Course.create({
      title,
      description,
      instructor,
      duration
    });

    res.status(201).json({
      message: "Course created successfully",
      course
    });
  } catch (error) {
    console.error("Course creation error:", error);

    res.status(500).json({
      message: "Course creation failed",
      error: error.message
    });
  }
};


// =========================
// GET ALL COURSES
// =========================
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    res.json({
      message: "Courses fetched successfully",
      courses
    });
  } catch (error) {
    console.error("Get courses error:", error);

    res.status(500).json({
      message: "Failed to fetch courses",
      error: error.message
    });
  }
};


// =========================
// UPDATE COURSE
// =========================
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      instructor,
      duration
    } = req.body;

    const course = await Course.findByIdAndUpdate(
      id,
      {
        title,
        description,
        instructor,
        duration
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    res.json({
      message: "Course updated successfully",
      course
    });
  } catch (error) {
    console.error("Course update error:", error);

    res.status(500).json({
      message: "Course update failed",
      error: error.message
    });
  }
};


// =========================
// DELETE COURSE
// =========================
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    res.json({
      message: "Course deleted successfully"
    });
  } catch (error) {
    console.error("Course delete error:", error);

    res.status(500).json({
      message: "Course deletion failed",
      error: error.message
    });
  }
};


module.exports = {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse
};
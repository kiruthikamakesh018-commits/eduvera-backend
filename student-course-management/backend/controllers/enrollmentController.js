const Enrollment = require("../models/Enrollment");
const mongoose = require("mongoose");


// ==========================================
// ENROLL IN COURSE
// ==========================================

const enrollCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    console.log("Enrollment request:", {
      studentId,
      courseId
    });

    if (!studentId || !courseId) {
      return res.status(400).json({
        message: "Student ID and Course ID are required"
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      return res.status(400).json({
        message: "Invalid student ID or course ID"
      });
    }

    const existingEnrollment =
      await Enrollment.findOne({
        student: studentId,
        course: courseId
      });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "Already enrolled in this course"
      });
    }

    const enrollment =
      await Enrollment.create({
        student: studentId,
        course: courseId
      });

    console.log(
      "Enrollment created:",
      enrollment._id
    );

    res.status(201).json({
      message: "Course enrolled successfully",
      enrollment
    });

  } catch (error) {
    console.error(
      "Enrollment error:",
      error
    );

    res.status(500).json({
      message: "Enrollment failed",
      error: error.message
    });
  }
};


// ==========================================
// GET MY COURSES
// ==========================================

const getMyCourses = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        message: "Student ID is required"
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(studentId)
    ) {
      return res.status(400).json({
        message: "Invalid student ID"
      });
    }

    const enrollments =
      await Enrollment.find({
        student: studentId
      })
        .populate(
          "course",
          "title description instructor duration"
        );

    res.json({
      message:
        "Enrolled courses fetched successfully",
      enrollments
    });

  } catch (error) {
    console.error(
      "Get enrolled courses error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch enrolled courses",
      error: error.message
    });
  }
};


// ==========================================
// GET ALL REGISTERED STUDENTS
// ==========================================

const getRegisteredStudents = async (req, res) => {
  try {
    console.log(
      "Fetching registered students..."
    );

    const enrollments =
      await Enrollment.find()
        .populate(
          "student",
          "name email role"
        )
        .populate(
          "course",
          "title description instructor duration"
        )
        .sort({
          createdAt: -1
        });

    console.log(
      "Total enrollments:",
      enrollments.length
    );

    const students = enrollments.map(
      (enrollment) => ({
        _id: enrollment._id,

        student: enrollment.student,

        course: enrollment.course,

        enrolledAt:
          enrollment.createdAt
      })
    );

    res.json({
      message:
        "Registered students fetched successfully",

      students
    });

  } catch (error) {
    console.error(
      "Get registered students error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load registered students",

      error: error.message
    });
  }
};


module.exports = {
  enrollCourse,
  getMyCourses,
  getRegisteredStudents
};
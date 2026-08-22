const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Student = require("./student.model");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ===============================
// KẾT NỐI MONGODB ATLAS
// ===============================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected!");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// ===============================
// API KIỂM TRA BACKEND
// ===============================

// API kiểm tra Backend
app.get("/", (req, res) => {
  res.json({
    message: "MERN Backend is running",
  });
});

// API kiểm tra Backend
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Backend đang hoạt động",
  });
});

// ===============================
// CÂU 36: LẤY DANH SÁCH SINH VIÊN
// GET /api/students
// ===============================
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ===============================
// CÂU 37: THÊM SINH VIÊN
// POST /api/students
// ===============================
app.post("/api/students", async (req, res) => {
  try {
    const student = await Student.create(req.body);

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// ===============================
// CÂU 61: CẬP NHẬT SINH VIÊN
// PUT /api/students/:id
// ===============================
app.put("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        studentId: req.body.studentId,
        name: req.body.name,
        email: req.body.email,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // Không tìm thấy sinh viên
    if (!student) {
      return res.status(404).json({
        message: "Không tìm thấy sinh viên",
      });
    }

    // Trả về sinh viên sau khi cập nhật
    res.json(student);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// ===============================
// CÂU 62: XÓA SINH VIÊN
// DELETE /api/students/:id
// ===============================
app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    // Không tìm thấy sinh viên
    if (!student) {
      return res.status(404).json({
        message: "Không tìm thấy sinh viên",
      });
    }

    // Trả về kết quả xóa
    res.json({
      message: "Xóa sinh viên thành công",
      student: student,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});
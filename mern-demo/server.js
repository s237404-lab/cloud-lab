
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ==========================================
// 1. MIDDLEWARE - CẤU HÌNH CORS CHO PRODUCTION
// ==========================================

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000"
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép request không có Origin
    // hoặc Origin nằm trong danh sách cho phép
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

// ==========================================
// 2. SCHEMA & MODEL SINH VIÊN
// ==========================================

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

const Student = mongoose.model("Student", studentSchema);

// ==========================================
// 3. GET - LẤY DANH SÁCH SINH VIÊN
// ==========================================

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// ==========================================
// 4. POST - THÊM SINH VIÊN
// ==========================================

app.post("/api/students", async (req, res) => {
  try {
    const student = await Student.create(req.body);

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// ==========================================
// 5. PUT - CẬP NHẬT SINH VIÊN
// ==========================================

app.put("/api/students/:id", async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// ==========================================
// 6. DELETE - XÓA SINH VIÊN
// ==========================================

app.delete("/api/students/:id", async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json({
      message: "Deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// ==========================================
// 7. KẾT NỐI MONGODB ATLAS VÀ CHẠY SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
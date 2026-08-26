global.crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Kết nối MongoDB Atlas
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Đã kết nối MongoDB Atlas thành công'))
    .catch(err => console.error('Lỗi kết nối MongoDB:', err));
}

// 2. Định nghĩa Schema & Model cho Mongoose
const studentSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  email: String
});
const Student = mongoose.model('Student', studentSchema);

// ------------------------------------
// CÂU 45: API kiểm tra Backend
// ------------------------------------
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend đang hoạt động' });
});

// ------------------------------------
// CÂU 46: API Lấy danh sách từ MongoDB Atlas
// ------------------------------------
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ------------------------------------
// CÂU 75: API Thêm sinh viên VÀO MONGODB ATLAS
// ------------------------------------
app.post('/api/students', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;
    
    // Tạo document mới và lưu trực tiếp vào Database Cloud
    const newStudent = new Student({
      studentId: studentId || "SV003",
      name: name || "Sinh viên mới",
      email: email || "sv@gmail.com"
    });
    
    await newStudent.save(); // Lệnh lưu vào Atlas chính thức
    console.log("Đã lưu vào MongoDB Atlas:", newStudent);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ------------------------------------
// CÂU 61: API Cập nhật sinh viên
// ------------------------------------
app.put('/api/students/:id', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { studentId, name, email },
      { new: true }
    );
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ------------------------------------
// CÂU 62: API Xóa sinh viên
// ------------------------------------
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa sinh viên" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});
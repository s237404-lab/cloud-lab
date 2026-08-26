import { useEffect, useState } from "react";

const API_URL =
  "http://localhost:5000/api/students";
function App() {
  const [students, setStudents] = useState([]);

  // State form
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ID của sinh viên đang sửa
  const [editingId, setEditingId] = useState(null);

  // Reset form về trạng thái ban đầu
  const resetForm = () => {
    setEditingId(null);
    setStudentId("");
    setName("");
    setEmail("");
  };

  // =========================
  // LẤY DANH SÁCH SINH VIÊN
  // =========================
  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Không thể lấy danh sách sinh viên");

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // =========================
  // THÊM / CẬP NHẬT SINH VIÊN
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentData = { studentId, name, email };

    try {
      // 1. CẬP NHẬT (PUT)
      if (editingId) {
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentData),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Cập nhật thất bại");
          return;
        }

        // Đảm bảo dữ liệu UI được cập nhật đúng dạng object sinh viên
        const updatedStudent = data.student || data; // dự phòng backend trả về { student: {...} }
        setStudents(
          students.map((item) =>
            item._id === editingId ? { ...item, ...studentData, ...updatedStudent } : item
          )
        );

        alert("Cập nhật sinh viên thành công!");
        resetForm();
        return;
      }

      // 2. THÊM MỚI (POST)
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Thêm sinh viên thất bại");
        return;
      }

      const newStudent = data.student || data;
      setStudents([...students, newStudent]);

      alert("Thêm sinh viên thành công!");
      resetForm();
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  // =========================
  // CHỌN SINH VIÊN ĐỂ SỬA
  // =========================
  const handleEdit = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId ? String(student.studentId).trim() : "");
    setName(student.name || "");
    setEmail(student.email || "");
  };

  // =========================
  // XÓA SINH VIÊN
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sinh viên này không?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Xóa thất bại");
        return;
      }

      // Cập nhật giao diện
      setStudents(students.filter((student) => student._id !== id));

      // Nếu đang sửa đúng sinh viên bị xóa thì reset form
      if (editingId === id) {
        resetForm();
      }

      alert("Xóa sinh viên thành công!");
    } catch (error) {
      console.error("Lỗi xóa:", error);
    }
  };

  return (
    <div>
      <h1>Danh sách sinh viên</h1>

      <h2>{editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="MSSV"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">{editingId ? "Cập nhật" : "Thêm sinh viên"}</button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Hủy
          </button>
        )}
      </form>

      <hr />

      {students.map((student) => (
        <div key={student._id}>
          <p><strong>Mã SV:</strong> {student.studentId}</p>
          <p><strong>Họ tên:</strong> {student.name}</p>
          <p><strong>Email:</strong> {student.email}</p>

          <button onClick={() => handleEdit(student)}>Sửa</button>
          <button onClick={() => handleDelete(student._id)}>Xóa</button>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;
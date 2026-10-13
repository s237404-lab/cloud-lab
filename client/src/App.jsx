
import { useEffect, useState } from "react";

const API_URL =
  "https://mern-backend-237404.onrender.com/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Làm mới form
  const resetForm = () => {
    setEditingId(null);
    setStudentId("");
    setName("");
    setEmail("");
  };

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Không thể tải danh sách sinh viên.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu sinh viên trả về không hợp lệ.");
      }

      setStudents(data);
    } catch (err) {
      setError(err.message || "Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Thêm hoặc cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentData = {
      studentId: studentId.trim(),
      name: name.trim(),
      email: email.trim(),
    };

    if (
      !studentData.studentId ||
      !studentData.name ||
      !studentData.email
    ) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const isEditing = Boolean(editingId);
      const url = isEditing
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEditing
              ? "Cập nhật sinh viên thất bại."
              : "Thêm sinh viên thất bại.")
        );
      }

      alert(
        isEditing
          ? "Cập nhật sinh viên thành công!"
          : "Thêm sinh viên thành công!"
      );

      resetForm();
      await fetchStudents();
    } catch (err) {
      alert(err.message || "Không thể kết nối máy chủ.");
    }
  };

  // Chọn sinh viên cần sửa
  const handleEdit = (student) => {
    setEditingId(student._id);
    setStudentId(String(student.studentId || ""));
    setName(student.name || "");
    setEmail(student.email || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Xóa sinh viên
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa sinh viên này không?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Xóa sinh viên thất bại.");
      }

      setStudents((current) =>
        current.filter((student) => student._id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      alert("Xóa sinh viên thành công!");
    } catch (err) {
      alert(err.message || "Không thể kết nối máy chủ.");
    }
  };

  return (
    <div className="app">
      <h1>Danh sách sinh viên</h1>
      <p className="version-label">
        Phiên bản ứng dụng: v2.0
      </p>

      <h2>
        {editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}
      </h2>

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

        <button type="submit">
          {editingId ? "Cập nhật" : "Thêm sinh viên"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Hủy
          </button>
        )}
      </form>

      <hr />

      <h2>Danh sách sinh viên ({students.length})</h2>

      {loading && <p>Đang tải danh sách sinh viên...</p>}

      {!loading && error && (
        <div>
          <p role="alert">{error}</p>
          <button type="button" onClick={fetchStudents}>
            Thử tải lại
          </button>
        </div>
      )}

      {!loading && !error && students.length === 0 && (
        <p>Chưa có sinh viên nào.</p>
      )}

      {!loading &&
        !error &&
        students.map((student) => (
          <div key={student._id}>
            <p>
              <strong>Mã SV:</strong> {student.studentId}
            </p>
            <p>
              <strong>Họ tên:</strong> {student.name}
            </p>
            <p>
              <strong>Email:</strong> {student.email}
            </p>

            <button
              type="button"
              onClick={() => handleEdit(student)}
            >
              Sửa
            </button>

            <button
              type="button"
              onClick={() => handleDelete(student._id)}
            >
              Xóa
            </button>

            <hr />
          </div>
        ))}
    </div>
  );
}

export default App;

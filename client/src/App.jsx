import { useEffect, useState } from "react";

const API_URL =
  "https://opulent-palm-tree-r7pgg5vqp56xh64q-5000.app.github.dev/api/students";

function App() {
  const [students, setStudents] = useState([]);

  // State cho form
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ID của sinh viên đang sửa
  const [editingId, setEditingId] = useState(null);

  // =========================
  // LẤY DANH SÁCH SINH VIÊN
  // =========================
  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách sinh viên");
      }

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

    try {
      // =========================
      // CÂU 61: CẬP NHẬT
      // =========================
      if (editingId) {
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            name,
            email,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Lỗi cập nhật:", data);
          alert(data.message || "Cập nhật thất bại");
          return;
        }

        // Cập nhật sinh viên trên giao diện
        setStudents(
          students.map((student) =>
            student._id === editingId ? data : student
          )
        );

        alert("Cập nhật sinh viên thành công!");

        // Reset form
        setEditingId(null);
        setStudentId("");
        setName("");
        setEmail("");

        return;
      }

      // =========================
      // CÂU 49: THÊM SINH VIÊN
      // =========================
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          name,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Lỗi thêm:", data);
        alert(data.message || "Thêm sinh viên thất bại");
        return;
      }

      // Thêm sinh viên mới vào danh sách
      setStudents([...students, data]);

      alert("Thêm sinh viên thành công!");

      // Xóa nội dung form
      setStudentId("");
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  // =========================
  // CÂU 61: BẤM NÚT SỬA
  // =========================
  const handleEdit = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId.trim());
    setName(student.name);
    setEmail(student.email);
  };

  // =========================
  // CÂU 62: XÓA SINH VIÊN
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa sinh viên này không?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Lỗi xóa:", data);
        alert(data.message || "Xóa thất bại");
        return;
      }

      // Xóa khỏi danh sách trên giao diện
      setStudents(
        students.filter((student) => student._id !== id)
      );

      alert("Xóa sinh viên thành công!");
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  // =========================
  // HỦY CHẾ ĐỘ SỬA
  // =========================
  const handleCancel = () => {
    setEditingId(null);
    setStudentId("");
    setName("");
    setEmail("");
  };

  return (
    <div>
      <h1>Danh sách sinh viên</h1>

      {/* =========================
          FORM
      ========================= */}
      <h2>
        {editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="MSSV"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />

        <input
          type="text"
          placeholder="Họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">
          {editingId ? "Cập nhật" : "Thêm sinh viên"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel}>
            Hủy
          </button>
        )}
      </form>

      <hr />

      {/* =========================
          DANH SÁCH SINH VIÊN
      ========================= */}
      {students.map((student) => (
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

          {/* Nút Sửa - Câu 61 */}
          <button onClick={() => handleEdit(student)}>
            Sửa
          </button>

          {/* Nút Xóa - Câu 62 */}
          <button onClick={() => handleDelete(student._id)}>
            Xóa
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;
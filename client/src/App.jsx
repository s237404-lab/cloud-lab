import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  // State cho Form
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Lấy danh sách sinh viên
  useEffect(() => {
    fetch(
      "https://opulent-palm-tree-r7pgg5vqp56xh64q-5000.app.github.dev/api/students"
    )
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error("Lỗi lấy danh sách:", error);
      });
  }, []);

  // Câu 49: Thêm sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://opulent-palm-tree-r7pgg5vqp56xh64q-5000.app.github.dev/api/students",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: studentId,
            name: name,
            email: email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Lỗi từ server:", data);
        return;
      }

      console.log("Sinh viên đã thêm:", data);

      // Cập nhật danh sách ngay trên giao diện
      setStudents([...students, data]);

      // Xóa form sau khi thêm
      setStudentId("");
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  return (
    <div>
      <h1>Danh sách sinh viên</h1>

      {/* Form thêm sinh viên - Câu 48 */}
      <h2>Thêm sinh viên</h2>

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

        <button type="submit">Thêm sinh viên</button>
      </form>

      {/* Danh sách sinh viên */}
      {students.map((student) => (
        <div key={student._id}>
          <p>Mã SV: {student.studentId}</p>
          <p>Họ tên: {student.name}</p>
          <p>Email: {student.email}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;
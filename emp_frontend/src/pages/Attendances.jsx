// const Attendances = () => {
//   return (
//     <div>
//       <h2>Attendance</h2>
//       <p>Attendance marking and records go here.</p>
//     </div>
//   );
// };

// export default Attendances;

import React, { useEffect, useState } from "react";
import {
  listAttendence,
  createAttendence,
  getAttendence,
  updateAttendence,
  deleteAttendence,
  partialUpdateAttendence,
} from "../api/attendanceApi"; // adjust the path if needed

const Attendances = () => {
  const [attendances, setAttendances] = useState([]);
  const [formData, setFormData] = useState({ employee: "", date: "", status: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch attendance records on mount
  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const res = await listAttendence();
      setAttendances(res.data);
    } catch (err) {
      setError("Failed to fetch attendance records.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAttendence(editingId, formData);
        setEditingId(null);
      } else {
        await createAttendence(formData);
      }
      setFormData({ employee: "", date: "", status: "" });
      fetchAttendances();
    } catch (err) {
      setError("Failed to save attendance.");
      console.error(err);
    }
  };

  const handleEdit = (attendance) => {
    setEditingId(attendance.id);
    setFormData({
      employee: attendance.employee,
      date: attendance.date,
      status: attendance.status || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) return;
    try {
      await deleteAttendence(id);
      fetchAttendances();
    } catch (err) {
      setError("Failed to delete attendance.");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Attendances</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Attendance Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="employee"
          placeholder="Employee ID"
          value={formData.employee}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="">Select Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Leave">Leave</option>
        </select>
        <button type="submit">{editingId ? "Update" : "Add"} Attendance</button>
      </form>

      {/* Attendance List */}
      {loading ? (
        <p>Loading attendance records...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendances.length > 0 ? (
              attendances.map((att) => (
                <tr key={att.id}>
                  <td>{att.id}</td>
                  <td>{att.employee}</td>
                  <td>{att.date}</td>
                  <td>{att.status}</td>
                  <td>
                    <button onClick={() => handleEdit(att)}>Edit</button>
                    <button onClick={() => handleDelete(att.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No attendance records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Attendances;

import React, { useEffect, useState } from "react";
import {
  listAttendence,
  createAttendence,
  updateAttendence,
  deleteAttendence,
} from "../api/attendanceApi";

const Attendances = () => {
  const [attendances, setAttendances] = useState([]);
  const [formData, setFormData] = useState({ employee: "", status: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isStaff, setIsStaff] = useState(false); // optional, if you can detect user role

  // Fetch attendance records on mount
  useEffect(() => {
    fetchAttendances();
    // optionally fetch user role from API or context
  }, []);

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const res = await listAttendence();
      setAttendances(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch attendance records.");
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
        // Don't send `employee` if normal user (backend auto-fills)
        const dataToSend = { ...formData };
        if (!isStaff) delete dataToSend.employee;

        await createAttendence(dataToSend);
      }

      setFormData({ employee: "", status: "" });
      fetchAttendances();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        setError(
          err.response.data.detail ||
            "Attendance already marked for today or invalid input."
        );
      } else {
        setError("Failed to save attendance.");
      }
    }
  };

  const handleEdit = (attendance) => {
    setEditingId(attendance.id);
    setFormData({
      employee: attendance.employee,
      status: attendance.status,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?"))
      return;
    try {
      await deleteAttendence(id);
      fetchAttendances();
    } catch (err) {
      console.error(err);
      setError("Failed to delete attendance.");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "700px", margin: "auto" }}>
      <h2>Attendance Management</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Attendance Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        {isStaff && (
          <input
            type="text"
            name="employee"
            placeholder="Employee ID"
            value={formData.employee}
            onChange={handleChange}
            required
          />
        )}
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="">Select Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
        <button type="submit" style={{ marginLeft: "10px" }}>
          {editingId ? "Update" : "Mark"} Attendance
        </button>
      </form>

      {/* Attendance Table */}
      {loading ? (
        <p>Loading attendance records...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Date</th>
              <th>Status</th>
              <th>Check-In</th>
              <th>Check-Out</th>
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
                  <td>{att.check_in || "—"}</td>
                  <td>{att.check_out || "—"}</td>
                  <td>
                    <button onClick={() => handleEdit(att)}>Edit</button>{" "}
                    <button onClick={() => handleDelete(att.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Attendances;

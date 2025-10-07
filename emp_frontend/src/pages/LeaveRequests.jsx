import React, { useEffect, useState } from "react";
import {
  listLeaveRequests,
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
} from "../api/leaveRequestApi";

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch leave requests on mount
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const res = await listLeaveRequests();
      setLeaveRequests(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch leave requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await updateLeaveRequest(editingId, formData);
        setSuccess("Leave request updated successfully!");
      } else {
        await createLeaveRequest(formData);
        setSuccess("Leave request created successfully!");
      }

      setEditingId(null);
      setFormData({ start_date: "", end_date: "", reason: "" });
      fetchLeaveRequests();
    } catch (err) {
      console.error(err.response?.data || err);
      setError(
        err.response?.data?.non_field_errors?.[0] ||
          "Failed to save leave request."
      );
    }
  };

  const handleEdit = (lr) => {
    setEditingId(lr.id);
    setFormData({
      start_date: lr.start_date,
      end_date: lr.end_date,
      reason: lr.reason,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave request?"))
      return;

    try {
      await deleteLeaveRequest(id);
      setSuccess("Leave request deleted successfully!");
      fetchLeaveRequests();
    } catch (err) {
      console.error(err);
      setError("Failed to delete leave request.");
    }
  };

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h2>Leave Requests</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <label>Start Date:</label>
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />

        <label>End Date:</label>
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          required
        />

        <label>Reason:</label>
        <input
          type="text"
          name="reason"
          placeholder="Enter reason"
          value={formData.reason}
          onChange={handleChange}
          required
        />

        <button type="submit" style={{ marginLeft: "10px" }}>
          {editingId ? "Update" : "Add"} Leave
        </button>
      </form>

      {/* Table */}
      {loading ? (
        <p>Loading leave requests...</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead style={{ backgroundColor: "#f8f8f8" }}>
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Approved By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.length > 0 ? (
              leaveRequests.map((lr) => (
                <tr key={lr.id}>
                  <td>{lr.id}</td>
                  <td>{lr.employee?.name || "N/A"}</td>
                  <td>{lr.start_date}</td>
                  <td>{lr.end_date}</td>
                  <td>{lr.reason}</td>
                  <td>{lr.status}</td>
                  <td>{lr.approved_by || "-"}</td>
                  <td>
                    <button onClick={() => handleEdit(lr)}>Edit</button>
                    <button onClick={() => handleDelete(lr.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveRequests;

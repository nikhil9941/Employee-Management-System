// const LeaveRequests = () => {
//   return (
//     <div>
//       <h2>Leave Requests</h2>
//       <p>Leave requests will be shown here.</p>
//     </div>
//   );
// };

// export default LeaveRequests;


import React, { useEffect, useState } from "react";
import {
  listLeaveRequests,
  createLeaveRequest,
  getLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
  partialUpdateLeaveRequest,
} from "../api/leaveRequestApi"; // adjust the path if needed

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [formData, setFormData] = useState({ employee: "", start_date: "", end_date: "", reason: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError("Failed to fetch leave requests.");
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
        await updateLeaveRequest(editingId, formData);
        setEditingId(null);
      } else {
        await createLeaveRequest(formData);
      }
      setFormData({ employee: "", start_date: "", end_date: "", reason: "" });
      fetchLeaveRequests();
    } catch (err) {
      setError("Failed to save leave request.");
      console.error(err);
    }
  };

  const handleEdit = (leaveRequest) => {
    setEditingId(leaveRequest.id);
    setFormData({
      employee: leaveRequest.employee,
      start_date: leaveRequest.start_date,
      end_date: leaveRequest.end_date,
      reason: leaveRequest.reason || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave request?")) return;
    try {
      await deleteLeaveRequest(id);
      fetchLeaveRequests();
    } catch (err) {
      setError("Failed to delete leave request.");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Leave Requests</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Leave Request Form */}
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
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="reason"
          placeholder="Reason"
          value={formData.reason}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? "Update" : "Add"} Leave Request</button>
      </form>

      {/* Leave Requests List */}
      {loading ? (
        <p>Loading leave requests...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.length > 0 ? (
              leaveRequests.map((lr) => (
                <tr key={lr.id}>
                  <td>{lr.id}</td>
                  <td>{lr.employee}</td>
                  <td>{lr.start_date}</td>
                  <td>{lr.end_date}</td>
                  <td>{lr.reason}</td>
                  <td>
                    <button onClick={() => handleEdit(lr)}>Edit</button>
                    <button onClick={() => handleDelete(lr.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No leave requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveRequests;

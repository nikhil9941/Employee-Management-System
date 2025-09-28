// const Employees = () => {
//   return (
//     <div>
//       <h2>Employees</h2>
//       <p>Employee list will be displayed here.</p>
//     </div>
//   );
// };

// export default Employees;

import React, { useEffect, useState } from "react";
import {
  listEmployee,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  partialUpdateEmployee,
} from "../api/employeeApi"; // make sure this path is correct

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ name: "", role: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await listEmployee();
      setEmployees(res.data);
    } catch (err) {
      setError("Failed to fetch employees.");
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
        // Update employee
        await updateEmployee(editingId, formData);
        setEditingId(null);
      } else {
        // Create employee
        await createEmployee(formData);
      }
      setFormData({ name: "", role: "" });
      fetchEmployees();
    } catch (err) {
      setError("Failed to save employee.");
      console.error(err);
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setFormData({ name: employee.name, role: employee.role });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await deleteEmployee(id);
      fetchEmployees();
    } catch (err) {
      setError("Failed to delete employee.");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Employees</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Employee Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="role"
          placeholder="Role"
          value={formData.role}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? "Update" : "Add"} Employee</button>
      </form>

      {/* Employee List */}
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.role}</td>
                  <td>
                    <button onClick={() => handleEdit(emp)}>Edit</button>
                    <button onClick={() => handleDelete(emp.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Employees;

// const Departments = () => {
//   return (
//     <div>
//       <h2>Departments</h2>
//       <p>Department list will be displayed here.</p>
//     </div>
//   );
// };

// export default Departments;


import React, { useEffect, useState } from "react";
import {
  listDepartments,
  createDepartment,
  getDepartment,
  updateDepartment,
  deleteDepartment,
  partialUpdateDepartment,
} from "../api/departmentApi"; // adjust the path if needed

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch departments on mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await listDepartments();
      setDepartments(res.data);
    } catch (err) {
      setError("Failed to fetch departments.");
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
        await updateDepartment(editingId, formData);
        setEditingId(null);
      } else {
        await createDepartment(formData);
      }
      setFormData({ name: "", description: "" });
      fetchDepartments();
    } catch (err) {
      setError("Failed to save department.");
      console.error(err);
    }
  };

  const handleEdit = (department) => {
    setEditingId(department.id);
    setFormData({ name: department.name, description: department.description || "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await deleteDepartment(id);
      fetchDepartments();
    } catch (err) {
      setError("Failed to delete department.");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Departments</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Department Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Department Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? "Update" : "Add"} Department</button>
      </form>

      {/* Department List */}
      {loading ? (
        <p>Loading departments...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length > 0 ? (
              departments.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.id}</td>
                  <td>{dept.name}</td>
                  <td>{dept.description}</td>
                  <td>
                    <button onClick={() => handleEdit(dept)}>Edit</button>
                    <button onClick={() => handleDelete(dept.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No departments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Departments;

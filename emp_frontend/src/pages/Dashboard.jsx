// const Dashboard = () => {
//   return (
//     <div>
//       <h2>Dashboard</h2>
//       <p>Welcome to Employee Management System.</p>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState } from "react";
import Employees from "./Employees";
import Departments from "./Departments";
import LeaveRequests from "./LeaveRequests";
import Attendances from "./Attendances";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("employees");

  const renderTab = () => {
    switch (activeTab) {
      case "employees":
        return <Employees />;
      case "departments":
        return <Departments />;
      case "leaveRequests":
        return <LeaveRequests />;
      case "attendances":
        return <Attendances />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <h1>HR Dashboard</h1>
      <div className="tabs">
        <button
          className={activeTab === "employees" ? "active" : ""}
          onClick={() => setActiveTab("employees")}
        >
          Employees
        </button>
        <button
          className={activeTab === "departments" ? "active" : ""}
          onClick={() => setActiveTab("departments")}
        >
          Departments
        </button>
        <button
          className={activeTab === "leaveRequests" ? "active" : ""}
          onClick={() => setActiveTab("leaveRequests")}
        >
          Leave Requests
        </button>
        <button
          className={activeTab === "attendances" ? "active" : ""}
          onClick={() => setActiveTab("attendances")}
        >
          Attendances
        </button>
      </div>

      <div className="tab-content">{renderTab()}</div>

      {/* Simple CSS for tabs */}
      <style>{`
        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .tabs button {
          padding: 10px 20px;
          border: none;
          background: #ddd;
          cursor: pointer;
          border-radius: 5px;
        }
        .tabs button.active {
          background: #007bff;
          color: white;
        }
        .tab-content {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

import { Link } from "react-router-dom";

const Sidebar = () => (
  <aside className="sidebar">
    <ul>
      <li><Link to="/dashboard">Dashboard</Link></li>
      <li><Link to="/employees">Employees</Link></li>
      <li><Link to="/departments">Departments</Link></li>
      <li><Link to="/attendances">Attendance</Link></li>
      <li><Link to="/leaverequests">Leave Requests</Link></li>
    </ul>
  </aside>
);

export default Sidebar;

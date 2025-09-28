// import { useState } from "react";
// import { login } from "../../api/authApi";
// import { useAuth } from "../../context/AuthContext";

// const Login = () => {
//   const [form, setForm] = useState({ username: "", password: "" });
//   const { loginUser } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await login(form);
//     loginUser(res.data.user); // adapt according to backend response
//     localStorage.setItem("access", res.data.access);
//     localStorage.setItem("refresh", res.data.refresh);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Login</h2>
//       <input
//         type="text"
//         placeholder="Username"
//         value={form.username}
//         onChange={(e) => setForm({ ...form, username: e.target.value })}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={form.password}
//         onChange={(e) => setForm({ ...form, password: e.target.value })}
//       />
//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default Login;


import { useState } from "react";
import { login } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(""); // for showing error messages
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear previous errors

    try {
      const res = await login(form);

      // If backend returns user and tokens
      if (res.status === 200) {
        const { user, access, refresh } = res.data;

        loginUser(user, access); // update AuthContext
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
      }
    } catch (err) {
      // Handle 401 Unauthorized
      if (err.response && err.response.status === 401) {
        setError("Invalid username or password. Please try again.");
      } else {
        setError("Something went wrong. Please try later.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* show error */}
      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;

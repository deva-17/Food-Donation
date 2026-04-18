import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [login, setLogin] = useState("");   // email OR register ID
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!login || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          login: login,
          password: password
        })
      });

      const data = await res.json();

      if (res.ok && data.role) {
        alert("Login Successful ✅");

        localStorage.setItem("user", JSON.stringify(data));

        // 🔥 redirect based on role (from backend)
        if (data.role === "donor") {
          navigate("/donor");
        } else if (data.role === "ngo") {
          navigate("/ngo");
        } else {
          navigate("/admin");
        }

      } else {
        alert(data.error || "Login Failed ❌");
      }

    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <div className="input-card">

            {/* 🔥 Email OR Register ID */}
            <input
              type="text"
              placeholder="Email or Register ID"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />

            {/* 🔥 Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
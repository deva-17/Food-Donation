import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
  if (!username || !email || !password || !phone || !role) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        password,
        role,
        phone
      })
    });

    const data = await res.json();
    console.log("RESPONSE:", data);   // 🔥 DEBUG

    if (res.ok) {
      alert("Registered Successfully ✅\nYour Register ID: " + data.register_id);

      setTimeout(() => {
        navigate("/login")
      },1500);
    } else {
      alert(data.error || "Registration failed ❌");
    }

  } catch (err) {
    console.error(err);
    alert("Server error ❌");
  }
};

  return (
    <div className="container">
      <div className="register-card">
        <h2>Register</h2>

        <div className="input-card">

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Phone */}
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <select
  value={role}
  onChange={(e) => setRole(e.target.value)}
  className={!role ? "placeholder" : ""}
>
  <option value="" disabled selected hidden>
    Select Role
  </option>
  <option value="donor">Donor</option>
  <option value="ngo">NGO</option>
</select>

          {/* Password */}
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

        </div>

        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

export default Register;
import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
  return (
    <div className="container">
      <h1>AI Powered Food Donation Platform</h1>
      <p>Reduce food waste. Feed the needy.</p>

      {/* 🔥 USER LOGIN */}
      <Link to="/login" className="btn">User Login</Link>

      {/* 🔥 ADMIN LOGIN */}
      <Link to="/login" className="btn admin-btn">Admin Login</Link>

      <p className="register-text">
      Don't have an account?{" "}
      <Link to="/register" className="register-link">
      Register
      </Link>
      </p>
    </div>
  );
}

export default Home;
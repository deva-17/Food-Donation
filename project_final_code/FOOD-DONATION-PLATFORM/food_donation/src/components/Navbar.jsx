import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/navbar.css";

function Navbar() {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // 🔥 GET USER
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // 🔔 FETCH NOTIFICATIONS
  useEffect(() => {
    if (!role) return;

    fetch(`http://127.0.0.1:8000/api/notifications/?type=${role}`)
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error(err));
  }, [role]);

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <nav className="navbar">

      {/* ===== LEFT ===== */}
      <div className="left">
        <div className="brand">🍱 Food Donation</div>

        {role && (
          <span className="role-tag">
            {role.toUpperCase()}
          </span>
        )}
      </div>

      {/* ===== CENTER ===== */}
      <div className="nav-links">

        <Link className={location.pathname === "/" ? "active" : ""} to="/">
          Home
        </Link>

        {role === "donor" && (
          <>
            <Link className={location.pathname === "/donor" ? "active" : ""} to="/donor">
              Dashboard
            </Link>
            <Link className={location.pathname === "/donor/add" ? "active" : ""} to="/donor/add">
              Add Donation
            </Link>
            <Link className={location.pathname === "/donor/status" ? "active" : ""} to="/donor/status">
              Status
            </Link>
          </>
        )}

        {role === "ngo" && (
          <>
            <Link className={location.pathname === "/ngo" ? "active" : ""} to="/ngo">
              Dashboard
            </Link>
            <Link className={location.pathname === "/ngo/donations" ? "active" : ""} to="/ngo/donations">
              Donations
            </Link>
          </>
        )}

        {role === "admin" && (
          <Link className={location.pathname === "/admin" ? "active" : ""} to="/admin">
            Admin Dashboard
          </Link>
        )}

      </div>

      {/* ===== RIGHT ===== */}
      <div className="right">

        {role && (
          <>
            {/* 🔔 BELL */}
            <div
              className="bell"
              onClick={() => setShow(!show)}
            >
              🔔
              {unreadCount > 0 && (
                <span className="badge">{unreadCount}</span>
              )}
            </div>

            {/* 🚪 LOGOUT */}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

      </div>

      {/* ===== DROPDOWN ===== */}
      {show && (
        <div className="dropdown">
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((n, i) => (
              <p key={i}>{n.message}</p>
            ))
          )}
        </div>
      )}

    </nav>
  );
}

export default Navbar;
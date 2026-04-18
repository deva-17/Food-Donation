import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/admin.css";

function AdminDashboard() {
  const [data, setData] = useState({
    users: [],
    donations: [],
    accepted: []
  });

  const [stats, setStats] = useState({
    total_donations: 0,
    total_food: 0
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/admin-data/")
      .then(res => res.json())
      .then(data => {
        setData({
          users: data.users || [],
          donations: data.donations || [],
          accepted: data.accepted || []
        });
      });

    fetch("http://127.0.0.1:8000/api/admin-stats/")
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  return (
    <>
      <Navbar />

      <div className="admin-container">

        {/* 🔥 HEADER */}
        <h1 className="admin-title">Admin Dashboard</h1>

        {/* 📊 STATS */}
        <div className="stats-row">
          <div className="stat-card">
            <h2>{stats.total_donations}</h2>
            <p>Total Donations</p>
          </div>

          <div className="stat-card">
            <h2>{stats.total_food} kg</h2>
            <p>Food Saved</p>
          </div>
        </div>

        {/* 👤 USERS */}
        <section>
          <h3 className="section-title">👤 Registered Users</h3>
          <div className="grid-container">
            {data.users.map((u, i) => (
              <div key={i} className="glass-card">
                <p><b>{u.username}</b></p>
                <p>{u.email}</p>
                <p>{u.role}</p>
                <p>{u.phone}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🍱 DONATIONS */}
        <section>
          <h3 className="section-title">🍱 All Donations</h3>
          <div className="grid-container">
            {data.donations.map((d, i) => (
              <div key={i} className="glass-card">

                {d.photo && (
                  <img src={`http://127.0.0.1:8000${d.photo}`} alt="food" />
                )}

                <p><b>{d.food_type}</b></p>
                <p>{d.quantity} kg</p>
                <p>{d.location}</p>
                <p>Status: {d.status}</p>
                <p>Donor: {d.donor}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🤝 ACCEPTED */}
        <section>
          <h3 className="section-title">🤝 Accepted Donations</h3>
          <div className="grid-container">
            {data.accepted.map((a, i) => (
              <div key={i} className="glass-card">
                <p><b>{a.food_type}</b></p>
                <p>{a.location}</p>
                <p>NGO: {a.ngo}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}

export default AdminDashboard;
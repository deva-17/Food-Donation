import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/donation2.css";

function DonationStatus() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/my/")
      .then((res) => res.json())
      .then((data) => {
        setDonations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      <div className="status-container">
        <h2>📊 Your Donations</h2>

        {loading && <p>Loading...</p>}

        {!loading && donations.length === 0 && (
          <p>No donations available.</p>
        )}

        <div className="grid-container">
          {!loading &&
            donations.map((d) => (
              <div key={d.id} className="glass-card">

                <p><b>🍱 Food:</b> {d.food_type || "-"}</p>
                <p><b>📝 Description:</b> {d.description || "-"}</p>
                <p><b>⚖ Quantity:</b> {d.quantity ? `${d.quantity} kg` : "-"}</p>
                <p><b>📍 Location:</b> {d.location || "-"}</p>
                <p><b>🚦 Status:</b> {d.status || "Unknown"}</p>

                {/* ✅ ONLY ACCEPTED BOX */}
                {d.status === "Accepted" && (
                  <div className="accepted-box">
                    ✅ Accepted by NGO
                  </div>
                )}

              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default DonationStatus;
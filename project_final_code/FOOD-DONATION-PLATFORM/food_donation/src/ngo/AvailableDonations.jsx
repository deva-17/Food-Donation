import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/ngo.css";

function AvailableDonations() {
  const [donations, setDonations] = useState([]);
  

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/all/")
      .then((res) => res.json())
      .then((data) => setDonations(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  const acceptDonation = async (id) => {
  const user = JSON.parse(localStorage.getItem("user"));

  await fetch(`http://127.0.0.1:8000/api/accept/${id}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ngo_name: user?.email   // 🔥 sending NGO identity
    })
  });

  alert("Accepted ✅");
  window.location.reload();
};

   

  return (
    <>
      <Navbar />

      <div className="available-container">
        <h2>🍽 Available Donations</h2>

        {donations.length === 0 && <p>No donations available.</p>}

        <div className="grid-container">
          {donations.map((d) => (
            <div key={d.id} className="glass-card">

              <p><b>🍱 Food:</b> {d.food_type}</p>
              <p><b>📝 Description:</b> {d.description}</p>
              <p><b>⚖ Quantity:</b> {d.quantity} kg</p>
              <p><b>📍 Location:</b> {d.location}</p>

              <p><b>🌿 Freshness:</b> {d.freshness}</p>
              <p><b>🤝 Recommended NGO:</b> {d.recommended_ngo}</p>
              <img 
  src={d.photo_url || `http://127.0.0.1:8000${d.photo}`} 
  alt="food"
  style={{
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px"
  }}
/>

              <button onClick={() => acceptDonation(d.id)}>
                Accept Donation
              </button>

            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AvailableDonations;
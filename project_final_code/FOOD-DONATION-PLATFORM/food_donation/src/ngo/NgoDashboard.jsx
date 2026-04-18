import { useEffect } from "react";   // ✅ FIX
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import "../styles/ngo2.css";

function NgoDashboard() {

  

  return (
    <>
      <Navbar />

      <div className="ngo-container">
        <h2>NGO Dashboard</h2>

        <Link className="ngo-btn" to="/ngo/donations">
          View Available Donations
        </Link>
      </div>
    </>
  );
}

export default NgoDashboard;
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import "../styles/donor.css"

function DonorDashboard() {

  

  return (
    <>
      <Navbar />

      <div className="donor-container">
        <h2>Donor Dashboard</h2>

        <Link className="donor-btn" to="/donor/add">
          Add Donation
        </Link>

        <Link className="donor-btn" to="/donor/status">
          View Donation Status
        </Link>
      </div>
    </>
  );
}

export default DonorDashboard;
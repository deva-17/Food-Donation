import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import DonorDashboard from "./donor/DonorDashboard";
import AddDonation from "./donor/AddDonation";
import DonationStatus from "./donor/DonationStatus";

import NgoDashboard from "./ngo/NgoDashboard";
import AvailableDonations from "./ngo/AvailableDonations";

import AdminDashboard from "./admin/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/donor" element={
        <ProtectedRoute><DonorDashboard /></ProtectedRoute>
      } />
      <Route path="/donor/add" element={
        <ProtectedRoute><AddDonation /></ProtectedRoute>
      } />
      <Route path="/donor/status" element={
        <ProtectedRoute><DonationStatus /></ProtectedRoute>
      } />

      <Route path="/ngo" element={
        <ProtectedRoute><NgoDashboard /></ProtectedRoute>
      } />
      <Route path="/ngo/donations" element={
        <ProtectedRoute><AvailableDonations /></ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute><AdminDashboard /></ProtectedRoute>
      } />

    </Routes>
  );
}

export default App;

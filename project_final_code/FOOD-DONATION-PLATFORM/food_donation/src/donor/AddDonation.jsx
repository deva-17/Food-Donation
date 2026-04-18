import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/donation.css";

function AddDonation() {
  const [step, setStep] = useState(1);
  const [foodType, setFoodType] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleNext = () => setStep(2);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 FIELD VALIDATION (CLEAR MESSAGES)
    if (!foodType) {
      alert("Please select Food Type 🍱");
      return;
    }

    if (!quantity) {
      alert("Please enter Quantity ⚖️");
      return;
    }

    if (!description) {
      alert("Please enter Description 📝");
      return;
    }

    if (!prepTime) {
      alert("Please select Preparation Time ⏰");
      return;
    }

    if (!photo) {
      alert("Please upload Food Photo 📸");
      return;
    }

    if (!location) {
      alert("Please enter Location 📍");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("food_type", foodType);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("prep_time", prepTime);
    formData.append("location", location);
    formData.append("photo", photo);

    const user = JSON.parse(localStorage.getItem("user"));
    formData.append("email", user?.email);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/add/", {
        method: "POST",
        body: formData
      });

      // 🔥 SAFE RESPONSE HANDLING
      let data;

      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error("Server returned HTML:", text);
        alert("Server error ❌ (check backend)");
        setSubmitting(false);
        return;
      }

      if (res.ok) {
        alert("Donation Submitted ✅");

        // 🔥 RESET FORM
        setFoodType("");
        setDescription("");
        setQuantity("");
        setPrepTime("");
        setLocation("");
        setPhoto(null);

        setStep(1);
      } else {
        alert(data.error || "Error submitting donation ❌");
      }

    } catch (err) {
      console.error(err);
      alert("Server connection error ❌");
    }

    setSubmitting(false);
  };

  return (
    <>
      <Navbar />

      <div className="container">

        {/* ===== STEP 1 ===== */}
        {step === 1 && (
          <div className="instructions-card">
            <h2>Donation Guidelines</h2>
            <ul>
              <li>✅ <strong>Safe to Donate:</strong> Freshly cooked meals, packaged food, dry food, fruits & vegetables, bakery items, sealed drinks.</li>
              <li>❌ <strong>Do Not Donate:</strong> Raw meat, seafood, expired/spoiled food, alcohol, perishable dairy left outside refrigeration.</li>
              <li>⚠ <strong>Preparation Time:</strong> Cooked meals should be donated within 4 hours.</li>
              <li>📸 <strong>Food Photo:</strong> Upload a photo of the food. Mandatory!</li>
              <li>📍 <strong>Pickup Location:</strong> Provide clear address/landmark.</li>
            </ul>

            <button className="next-button" onClick={handleNext}>
              I Have Read and Understood
            </button>
          </div>
        )}

        {/* ===== STEP 2 ===== */}
        {step === 2 && (
          <form className="donation-card" onSubmit={handleSubmit}>
            <h2>Add Donation</h2>

            <div className="form-row">
              <label>Food Type:</label>
              <select value={foodType} onChange={(e) => setFoodType(e.target.value)}>
                <option value="">Select Food</option>
                <option value="cooked">Cooked Meal</option>
                <option value="dry">Dry Food</option>
                <option value="fruits">Fruits / Vegetables</option>
                <option value="packaged">Packaged Food</option>
              </select>
            </div>

            <div className="form-row">
              <label>Quantity:</label>
              <input
                type="number"
                placeholder="Enter quantity (kg)"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Description:</label>
              <textarea
                placeholder="Enter food details (e.g., Rice, Curry...)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Prep Date & Time:</label>
              <input
                type="datetime-local"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Photo:</label>
              <input
                type="file"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>

            <div className="form-row">
              <label>Location:</label>
              <input
                type="text"
                placeholder="Enter full address or landmark"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Donation"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

export default AddDonation;
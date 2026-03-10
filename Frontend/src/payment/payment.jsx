import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./payment.css";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 📌 Receive data from SeatLayout
  const booking = location.state;

  // ❗ Always declare hooks at top (avoid hook error)
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // If no booking data
  if (!booking) {
    return <h2 style={{ textAlign: "center" }}>No Booking Found</h2>;
  }

  const { movieTitle, movieImage, seats, total } = booking;
  console.log("Booking Data:", booking);

  // 🎟 Confirm Booking
  const confirmBooking = async () => {

  if (!name || !mobile || !paymentMethod) {
    alert("Please fill all details!");
    return;
  }

  const res = await fetch("http://127.0.0.1:8000/api/book-ticket/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: localStorage.getItem("userEmail"),
      show_id: location.state.showId,
      name: name,
      phone: mobile,
      payment_method: paymentMethod,
      seats: seats.map(seat => ({
        seat_number: seat,
        seat_type: "General"
      })),
      total: total
    })
  });

  const data = await res.json();

  if (data.status) {

    const ticketData = {
      name,
      mobile,
      movieTitle,
      movieImage,
      seats,
      total,
      paymentMethod,
    };

    localStorage.setItem("ticket", JSON.stringify(ticketData));

    navigate("/ticket");
  } else {
    alert(data.message);
  }
};

  return (
    <div className="payment-page">
      <div className="payment-card">
        <img src={movieImage} alt={movieTitle} className="poster" />

        
        <div className="details">
          <h2>{movieTitle}</h2>
          <p><b>Seats:</b> {seats.join(", ")}</p>
          <p><b>Total:</b> ₹{total}</p>

          
          <input
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          
          <h3>Select Payment Method</h3>
          <div className="pay-options">
            <button onClick={() => setPaymentMethod("Google Pay")}>
              Google Pay
            </button>
            <button onClick={() => setPaymentMethod("PhonePe")}>
              PhonePe
            </button>
          </div>

          
          <button className="pay-btn" onClick={confirmBooking}>
            Pay ₹{total}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
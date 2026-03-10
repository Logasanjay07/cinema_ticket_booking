import React from "react";
import "./tickets.css";

function Ticket() {
  const ticket = JSON.parse(localStorage.getItem("ticket"));

  if (!ticket) return <h2>No Ticket Found</h2>;

  return (
    <div className="ticket-page">
      <div className="ticket-card">

        {/* Movie Poster */}
        <div className="ticket-poster">
          <img src={ticket.movieImage} alt={ticket.movieTitle} />
        </div>

        {/* Ticket Details */}
        <div className="ticket-details">
          <div className="confirm-badge">✔ Confirmed</div>

          <h2 className="ticket-title">{ticket.movieTitle}</h2>

          <div className="ticket-info">
            <p>Name: <span>{ticket.name}</span></p>
            <p>Mobile: <span>{ticket.mobile}</span></p>
            <p>Seats: <span>{ticket.seats.join(", ")}</span></p>
            <p>Category: <span>{ticket.category}</span></p>
            <p>Payment: <span>{ticket.paymentMethod}</span></p>
          </div>

          <div className="total-paid">
            Total Paid: ₹{ticket.total}
          </div>
          <p className="enjoy-msg">🎬 Enjoy Your Show 🍿</p>
        </div>

      </div>
    </div>
  );
}

export default Ticket;
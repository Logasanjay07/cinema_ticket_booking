import React, { useState, useEffect } from "react";
import "./seatLayout.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const normalRows = ["A", "B", "C", "D", "E", "F"];
const coupleRows = ["G", "H"];

function SeatLayout() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [genderMap, setGenderMap] = useState({});
  const [activeSeat, setActiveSeat] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [warning, setWarning] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const storedMovie = JSON.parse(localStorage.getItem("selectedMovie"));

const movieImage =
  location.state?.movieImage ||
  `http://127.0.0.1:8000${storedMovie?.poster}`;

const movieTitle =
  location.state?.movieTitle ||
  storedMovie?.title;

  // 🧠 Already booked seats from localStorage
  const [bookedSeats, setBookedSeats] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem(`bookedSeats-${id}`);
    if (saved) {
      setBookedSeats(JSON.parse(saved));
    }

    // 🔄 New booking fresh start
    setSelectedSeats([]);
    setGenderMap({});
  }, [id]);

  const getSeatPrice = (seatId) => {
    return seatId.startsWith("G") || seatId.startsWith("H") ? 180 : 150;
  };

  const totalPrice = selectedSeats.reduce(
    (t, s) => t + getSeatPrice(s),
    0
  );

  // 🔁 Toggle select / unselect
  const openPanel = (seatId) => {
    // ❌ Already booked seats click block
    if (bookedSeats[seatId]) return;

    // Unselect
    if (selectedSeats.includes(seatId)) {
      const row = seatId[0];
      const num = parseInt(seatId.slice(1));

      if (coupleRows.includes(row)) {
        const pairNum = num % 2 === 0 ? num + 1 : num - 1;
        const pairSeat = `${row}${pairNum}`;

        setSelectedSeats((prev) =>
          prev.filter((s) => s !== seatId && s !== pairSeat)
        );

        setGenderMap((prev) => {
          const updated = { ...prev };
          delete updated[seatId];
          delete updated[pairSeat];
          return updated;
        });
        return;
      }

      setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
      setGenderMap((prev) => {
        const updated = { ...prev };
        delete updated[seatId];
        return updated;
      });
      return;
    }

    // Open gender panel
    setActiveSeat(seatId);
    setSelectedType("");
    setWarning("");
  };

  const confirmSeat = () => {
    if (!selectedType) return;

    const seatId = activeSeat;
    const row = seatId[0];
    const num = parseInt(seatId.slice(1));

    // Couple seat logic
    if (coupleRows.includes(row) && selectedType === "Couple") {
      const pairNum = num % 2 === 0 ? num + 1 : num - 1;
      const pairSeat = `${row}${pairNum}`;

      setSelectedSeats((prev) => {
        const newSeats = new Set(prev);
        newSeats.add(seatId);
        newSeats.add(pairSeat);
        return Array.from(newSeats);
      });

      setGenderMap((prev) => ({
        ...prev,
        [seatId]: "Couple",
        [pairSeat]: "Couple",
      }));

      setActiveSeat(null);
      return;
    }

    // Normal seat select
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) return prev;
      return [...prev, seatId];
    });

    setGenderMap((prev) => ({ ...prev, [seatId]: selectedType }));
    setActiveSeat(null);
  };

  const renderSeat = (row, num) => {
    const seatId = `${row}${num}`;

    const isSelected = selectedSeats.includes(seatId);
    const type = genderMap[seatId];
    const bookedType = bookedSeats[seatId]; // locked seats

    return (
      <div
        key={seatId}
        className={`seat 
          ${bookedType ? bookedType.toLowerCase() : ""}
          ${isSelected ? "selected" : "available"} 
          ${type === "Ladies" ? "ladies" : ""} 
          ${type === "Gents" ? "gents" : ""} 
          ${type === "Couple" ? "couple" : ""}`}
        onClick={() => openPanel(seatId)}
      >
        {num}
      </div>
    );
  };

  return (
    <div className="seat-page">
      <div className="seat-container">
        <div className="seat-layout">
          <div className="screen">SCREEN</div>

          {normalRows.map((row) => (
            <div key={row} className="seat-row">
              <span className="row-label">{row}</span>

              <div className="seat-group">
                {[1, 2, 3, 4, 5].map((n) => renderSeat(row, n))}
              </div>

              <div className="seat-gap"></div>

              <div className="seat-group">
                {[6, 7, 8, 9, 10].map((n) => renderSeat(row, n))}
              </div>
            </div>
          ))}

          {coupleRows.map((row) => (
            <div key={row} className="seat-row">
              <span className="row-label">{row}</span>

              <div className="couple-row">
                {[1, 2].map((n) => renderSeat(row, n))}
                <div className="small-gap"></div>

                {[3, 4].map((n) => renderSeat(row, n))}
                <div className="small-gap"></div>

                <div className="empty-seat"></div>

                <div className="small-gap"></div>
                {[6, 7].map((n) => renderSeat(row, n))}
                <div className="small-gap"></div>

                {[8, 9].map((n) => renderSeat(row, n))}
              </div>
            </div>
          ))}

          {warning && <div className="warning">{warning}</div>}

          <div className="summary">
            <h3>Selected Seats: {selectedSeats.length}</h3>
            <h3>Total Price: ₹{totalPrice}</h3>

            <button
              className="book-btn"
              onClick={() => {
                if (selectedSeats.length === 0) {
                  setWarning("⚠️ Please select your seat");
                  return;
                }

                navigate("/payment", {
                  state: {
                    movieId: id,
                    movieTitle: movieTitle,
                    movieImage: movieImage,
                    seats: selectedSeats,
                    total: totalPrice,
                    showId: id
                  }
                });
              }}
            >
              Book Tickets
            </button>
          </div>

          <div className="legend">
            <span><div className="seat available"></div> Available</span>
            <span><div className="seat selected"></div> Selected</span>
            <span><div className="seat ladies"></div> Ladies</span>
            <span><div className="seat gents"></div> Gents</span>
            <span><div className="seat couple"></div> Couple</span>
          </div>
        </div>

        {activeSeat && (
          <div className="panel-wrapper">
            <div className="gender-panel">
              <h4>Select for Seat {activeSeat}</h4>

              {!coupleRows.includes(activeSeat[0]) && (
                <>
                  <label>
                    <input
                      type="radio"
                      value="Gents"
                      checked={selectedType === "Gents"}
                      onChange={(e) => setSelectedType(e.target.value)}
                    />
                    Gents
                  </label>

                  <label>
                    <input
                      type="radio"
                      value="Ladies"
                      checked={selectedType === "Ladies"}
                      onChange={(e) => setSelectedType(e.target.value)}
                    />
                    Ladies
                  </label>
                </>
              )}

              {coupleRows.includes(activeSeat[0]) && (
                <label>
                  <input
                    type="radio"
                    value="Couple"
                    checked={selectedType === "Couple"}
                    onChange={(e) => setSelectedType(e.target.value)}
                  />
                  Couple Seat
                </label>
              )}

              <button className="confirm-btn" onClick={confirmSeat}>
                Confirm Seat
              </button>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}

export default SeatLayout;
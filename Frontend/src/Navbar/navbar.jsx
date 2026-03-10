import React from "react";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import logo from "./cinema_time_logo_transparent.png";
function Navbar() {
  const navigate = useNavigate();


  const goToSection = (sectionId) => {
    navigate("/"); // go home

    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} alt="Cinema Time" className="nav-logo" />

      </div>

      <ul className="nav-links">
        <li onClick={() => goToSection("tamil")}>Tamil Movies</li>
        <li onClick={() => goToSection("hollywood")}>Hollywood Movies</li>
        <li onClick={() => goToSection("malayalam")}>Malayalam Movies</li>
      </ul>

      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("userEmail");
          window.location.reload();
        }}
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
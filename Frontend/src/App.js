import { useState } from "react";
import Login from "./Login/login";   // ✅ correct path
import Navbar from "./Navbar/navbar";
import Slider from "./Slider/slider";
import TamilMovies from "./Tamil_movie/tamilmovie";
import HollywoodMovies from "./Hollywood_movie/hollywood";
import MalayalamMovies from "./Malayalam_movie/malayalamMovie";
import MovieDetails from "./pages/movieDetails";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import ShowTimes from "./data/showTiming";
import PaymentPage from "./payment/payment";
import Ticket from "./Tickets/tickets";

function HomePage() {
  return (
    <>
      <Slider />
      <TamilMovies />
      <HollywoodMovies />
      <MalayalamMovies />
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userEmail")
  );

  return (
    <>
      {isLoggedIn && <Navbar />}

      <Routes>
        {/* Protected Routes */}
        <Route
          path="/"
          element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/movie/:id"
          element={isLoggedIn ? <MovieDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/book/:id"
          element={isLoggedIn ? <ShowTimes /> : <Navigate to="/login" />}
        />
        <Route
          path="/payment"
          element={isLoggedIn ? <PaymentPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/ticket"
          element={isLoggedIn ? <Ticket /> : <Navigate to="/login" />}
        />

        {/* Login Route */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
      </Routes>
    </>
  );
}

export default App;
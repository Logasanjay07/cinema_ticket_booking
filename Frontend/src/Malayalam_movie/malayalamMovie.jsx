import React, { useRef, useEffect, useState } from "react";
import "./malayalam.css";
import { useNavigate } from "react-router-dom";

function MalayalamMovies() {

  const scrollRef = useRef();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch("https://cinima-ticket-backend.onrender.com/api/movies/")
      .then((res) => res.json())
      .then((data) => {

        if (data.status) {

          const malayalamMovies = data.data.filter(
            (movie) => movie.language === "Malayalam"
          );

          setMovies(malayalamMovies);
        }

        setLoading(false);

      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setLoading(false);
      });

  }, []);

  const openMovie = (movie) => {

    localStorage.setItem("selectedMovie", JSON.stringify(movie));

    navigate(`/movie/${movie.id}`, {
      state: {
        movieTitle: movie.title,
        movieImage: `https://cinima-ticket-backend.onrender.com${movie.poster}`
      }
    });

  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (

    <div className="movie-section" id="malayalam">

      <h2 className="section-title">Malayalam Movies</h2>

      <button className="arrow left" onClick={scrollLeft}>❮</button>

      <div className="movie-row" ref={scrollRef}>

        {loading && <p>Loading movies...</p>}

        {!loading && movies.length === 0 && (
          <p>No Malayalam movies available</p>
        )}

        {movies.map((movie) => (

          <div
            className="movie-card"
            key={movie.id}
            onClick={() => openMovie(movie)}
          >

            <img
              src={`https://cinima-ticket-backend.onrender.com${movie.poster}`}
              alt={movie.title}
            />

            <div className="movie-info">

              <p className="rating">⭐</p>

              <h3>{movie.title}</h3>

              <p className="genre">{movie.language}</p>

            </div>

          </div>

        ))}

      </div>

      <button className="arrow right" onClick={scrollRight}>❯</button>

    </div>

  );

}

export default MalayalamMovies;
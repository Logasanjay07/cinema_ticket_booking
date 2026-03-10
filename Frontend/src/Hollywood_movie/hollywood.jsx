import React, { useRef, useEffect, useState } from "react";
import "./hollywood.css";
import { useNavigate } from "react-router-dom";

function HollywoodMovies() {

  const scrollRef = useRef();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {

    fetch("http://127.0.0.1:8000/api/movies/")
      .then(res => res.json())
      .then(data => {

        if (data.status) {

          const hollywoodMovies = data.data.filter(
            movie => movie.language === "Hollywood"
          )

          setMovies(hollywoodMovies)

        }

      })

  }, [])

  const openMovie = (movie) => {

    localStorage.setItem("selectedMovie", JSON.stringify(movie));

    navigate(`/movie/${movie.id}`, {
      state: {
        movieTitle: movie.title,
        movieImage: `http://127.0.0.1:8000${movie.poster}`
      }
    })

  }

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })
  }

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
  }

  return (

    <div className="movie-section" id="hollywood">

      <h2 className="section-title">Hollywood Movies</h2>

      <button className="arrow left" onClick={scrollLeft}>❮</button>

      <div className="movie-row" ref={scrollRef}>

        {movies.map(movie => (

          <div
            className="movie-card"
            key={movie.id}
            onClick={() => openMovie(movie)}
          >

            <img
              src={`http://127.0.0.1:8000${movie.poster}`}
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

  )

}

export default HollywoodMovies
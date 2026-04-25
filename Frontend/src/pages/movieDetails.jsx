import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./movieDetails.css";
import { useNavigate } from "react-router-dom";

function MovieDetails() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [movie, setMovie] = useState(null)
  const [tempRating, setTempRating] = useState(0)
  const [finalRating, setFinalRating] = useState(0)

  useEffect(() => {

    fetch(`https://cinima-ticket-backend.onrender.com/api/movies/${id}/`)
      .then(res => res.json())
      .then(data => {

        if (data.status) {

          setMovie(data.data)

        }

      })

  }, [id])

  useEffect(() => {

    const savedRating = localStorage.getItem(`rating-${id}`)

    if (savedRating) {
      setFinalRating(Number(savedRating))
    }

  }, [id])

  if (!movie) return <h2>Loading...</h2>

  const handleRateNow = async () => {

    const email = localStorage.getItem("userEmail");

    try {

      const res = await fetch("https://cinima-ticket-backend.onrender.com/api/rate-movie/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          movie_id: id,
          rating: tempRating
        }),
      });

      const data = await res.json();

      if (data.status) {
        setFinalRating(tempRating);
        alert("Rating saved successfully ⭐");
      }

    } catch (error) {
      console.error(error);
    }

  };

  return (

    <div className="details-container">

      <h1>Movie: {movie.title}</h1>

      <img
        src={`https://cinima-ticket-backend.onrender.com${movie.poster}`}
        alt={movie.title}
        className="details-img"
      />

      <p>Rating: {finalRating}/10</p>

      <div className="stars">

        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (

          <span
            key={star}
            onClick={() => setTempRating(star)}
            className={star <= tempRating ? "active" : ""}
          >
            ★
          </span>

        ))}

      </div>

      <button
        className="rate-btn"
        onClick={handleRateNow}
      >
        Rate Now
      </button>

      <button
  className="book-btn"
  onClick={() => {

    const movieData = {
      title: movie.title,
      poster: movie.poster
    };

    localStorage.setItem("selectedMovie", JSON.stringify(movieData));

    navigate(`/book/${id}`, {
      state: {
        movieTitle: movie.title,
        movieImage: `https://cinima-ticket-backend.onrender.com${movie.poster}`
      }
    });

  }}
>
  Book Tickets
</button>
    </div>

  )

}

export default MovieDetails;
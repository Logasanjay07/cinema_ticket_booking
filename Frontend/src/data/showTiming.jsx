import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./showTiming.css";
import SeatLayout from "../Seat/seatLayout";

function ShowTimes() {

 const { id } = useParams();

 const [shows, setShows] = useState([]);
 const [showSeats, setShowSeats] = useState(false);
 const [selectedDate, setSelectedDate] = useState(0);
 const [theme, setTheme] = useState("light");

 // 🔥 FETCH SHOWS FROM DJANGO
 useEffect(() => {

  fetch(`http://127.0.0.1:8000/api/shows/${id}/`)
  .then(res => res.json())
  .then(data => {

    console.log("SHOW API:", data);

    if(data.status){
      setShows(data.data);
    }

  });

 }, [id]);


 const toggleTheme = () => {
  setTheme(theme === "light" ? "dark" : "light");
 };


 const getNextDays = () => {

  const days = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {

    const nextDay = new Date();
    nextDay.setDate(today.getDate() + i);

    days.push({
      day: nextDay.toLocaleDateString("en-US",{ weekday:"short"}),
      date: nextDay.getDate(),
      month: nextDay.toLocaleDateString("en-US",{ month:"short"})
    });

  }

  return days;

 };

 const daysList = getNextDays();


 if (shows.length === 0) {
  return <h2>No shows available</h2>;
 }


 return (

 <div className={`showtimes-page ${theme}`}>

 <button className="theme-toggle" onClick={toggleTheme}>
 {theme === "light" ? "🌙 Dark" : "☀️ Light"}
 </button>

 <h1 className="title">Select Theatre & Timings 🎟</h1>


 {/* DATE SELECTOR */}
 <div className="date-row">

 {daysList.map((d,index)=>(

 <div
 key={index}
 className={`date-card ${selectedDate===index?"active":""}`}
 onClick={()=>setSelectedDate(index)}
 >

 <span className="day">{d.day}</span>
 <span className="date">{d.date}</span>
 <span className="month">{d.month}</span>

 </div>

 ))}

 </div>


 {/* SHOW LIST */}

 {shows.map((show)=>(

 <div className="theatre-card" key={show.id}>

 <div className="theatre-left">

 <h3>{show.theatre_name}</h3>
 <p>{show.theatre_location}</p>
 <p className="cancel">✔ Cancellation available</p>

 </div>

 <div className="timings">

 <button
 className="time-btn"
 onClick={()=>setShowSeats(true)}
 >

 {show.show_time}

 </button>

 </div>

 </div>

 ))}


 {showSeats && <SeatLayout />}

 </div>

 );

}

export default ShowTimes;
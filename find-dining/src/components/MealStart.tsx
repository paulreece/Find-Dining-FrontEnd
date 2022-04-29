import React from 'react'
import "./MealStart.css"
import axios from "axios"
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
const MealStart = () => {
const [location, setLocation] = useState("")
const [radius, setRadius] = useState("")
const [error, setError] = useState("")
const [success, setSuccess] = useState("")
const navigate = useNavigate();

  function handleCreateMeal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("")
    const options = {
      method: 'POST',
      url: 'https://find-dining-panda.herokuapp.com/api/meals/',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token a597b9035bc16eb84b9db749d4a1857fee663242'
      },
      data: {
        creator: 1,
        location: location,
        radius: radius,
        invitee: [1,2,3]
      }
    }
console.log(error)
    axios.request(options).then(function (response) {
      console.log(response.data)
      setSuccess("Meal Created!")
    }).catch((e) =>  {
      setError(e.message)
    })
    setTimeout(() => {
      navigate("/home");
    }, 2000);
  }
  return (
      <div className='mealStartPage'>
        <form onSubmit={handleCreateMeal}>
    <h2 className='mealWith'>Your Dinner with ______</h2>
    <div className='search'>
<h3>Search Location</h3>
<input type="input" onChange={(e) => setLocation(e.target.value)} className="searchInput" placeholder='Enter your City'></input>
    </div>
    <div className='radius'>
<h3>Set Radius </h3>
<input type="input" onChange={(e) => setRadius(e.target.value)} className="radiusInput" placeholder='Radius in miles'></input>
    </div>
    <div className="mealButtons">
    <div className="error">{error}</div>
    <div className="success">{success}</div>
    <button className='chowDown'>Chow Down!</button>
    <button className='noThanks'>No Thanks</button>
    </div>
    </form>
    </div>
  )
}

export default MealStart
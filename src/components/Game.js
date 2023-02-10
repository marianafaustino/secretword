import './Game.css'
import React, { useState } from 'react'

const Game = ({verifyLetter}) => {
  const [letter, setLetter]= useState()

  return (
    <div>
        <h1>Game</h1>
       <input type="text" name="letter" onChange={(e)=> setLetter(e.target.value)}/>
       <button onClick={()=> verifyLetter(letter)}>Confirmar</button>
    </div>
  )
}

export default Game
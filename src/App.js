import { useCallback, useEffect, useState } from 'react';
import './App.css';
import Game from './components/Game';
import GameOver from './components/GameOver';
import StartScreen from './components/StartScreen';
import {wordsList} from './data/word'

const stages=[
  {id: 1, name: 'start'},
  {id: 2, name: 'game'},
  {id: 3, name: 'end'}
]


const guessesQty = 3

function App() {

  const [gameStage, setGameStage]= useState(stages[0].name)
  const [words]= useState(wordsList)
  const [pickedWord, setPickedWord]= useState('')
  const [pickedCategory, setPickedCategory]= useState('')
  const [letters, setLetters]= useState([])
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)


  const pickWordAndCategory= useCallback(()=>{
    //pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * categories.length)]
    console.log(category)

    //pick a random word
    
    const word= words[category][Math.floor(Math.random() * words[category].length)]
    console.log(word)

    return { word,category}
  }, [words])

  // starts the secret word game
  const startGame= useCallback(()=>{
  //clear all letters
    clearLetterStates()
  // pick word and pick category
    const {word,category}= pickWordAndCategory()

    //create an array of letters
    let wordLetters = word.split("")

    wordLetters = wordLetters.map((l)=> l.toLowerCase())

    // fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  },[pickWordAndCategory])

  // process the letter input
  const verifyLetter= (letter)=>{
    const normalizedLetter = letter.toLowerCase()

 //checar se a letra já foi utilizada
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return
    }
  
 //mostrar a letra adivinhada ou perder uma chance
    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters)=>[
        ...actualGuessedLetters,
        normalizedLetter
      ])
    }else{
      setWrongLetters((actualWrongLetters)=>[
        ...actualWrongLetters,
        normalizedLetter
      ])

      setGuesses((actualGuesses)=> actualGuesses - 1)
    }

  }
  
  const clearLetterStates = ()=>{
    setGuessedLetters([])
    setWrongLetters([])
  }
  //checar se as tentativas acabaram
  useEffect(()=>{
    if(guesses <= 0){
      // resetar os states
      clearLetterStates()
      setGameStage(stages[2].name)
    }

  }, [guesses])

  //checar condição de vitŕoia
  useEffect(()=>{
    const uniqueLetters = [...new Set(letters)]

  //condição de vitória
    if(guessedLetters.length === uniqueLetters.length){
  // add score
      setScore((actualScore)=> (actualScore += 100))
  //reiniciar o jogo com uma nova palavra
      startGame()
    }
  }, [guessedLetters, letters, startGame])

  // restarts the game
  const retry= ()=>{
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/>} 

      {gameStage === 'game' && <Game 
      verifyLetter={verifyLetter} 
      pickedWord={pickedWord} 
      pickedCategory={pickedCategory} 
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}/>}

      {gameStage === 'end' && <GameOver retry={retry}
      score={score}/>}
    </div>
  );
}

export default App;

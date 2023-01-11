import { useCallback, useEffect, useState } from "react"
import { HangmanDrawing } from "./HangmanDrawing"
import { HangmanWord } from "./HangmanWord"
import { Keyboard } from "./Keyboard"
import words from "./wordList.json"

//Generates random word from JSON words list
function getWord() {
  return words[Math.floor(Math.random() * words.length)]
}

function App() {
  //set current state for wordToGuess and set update state function (setWordToGuess)
  const  [wordToGuess, setWordToGuess] = useState(getWord)

  //set current state for guessedLetters to empty string array 
  //set update state function (setGuessedLetters) 
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])

  //create incorrectLetters string array by filtering out letters 
  //that are not in the wordToGuess string (filter out correctly guessed 
  //letters from the guessed letter string array)
  const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter)
  )
  //isLoser if incorrectLetters array is equal to 6 (6 incorrect guesses completes hangman body parts)
  const isLoser = incorrectLetters.length == 6

  //split wordToGuess array by each letter, iterate over each letter, 
  //if guessedLetters array includes each letter in wordToGuess, isWinner is true (user has won).
  const isWinner = wordToGuess.split("").every(letter => guessedLetters.includes(letter))

  //useCallback hook to only render if the guessedLetters array has changed
  const addGuessedLetter = useCallback((letter: string) => {
    //if guessedLetters array already includes the guessed letter 
    //(user pressed a letter they already guessed before) 
    //or user won or user lost (game over) return (do nothing)
    if (guessedLetters.includes(letter) || isLoser || isWinner) return
    // otherwise update state to keep existing letters in guessed letters array 
    //and add new guessed letter to guessed letters array
    setGuessedLetters(currentLetters => [...currentLetters, letter])
  }, 
  [guessedLetters, isWinner, isLoser] //?
  )

  
useEffect(() => {
  // event handler for keyboard event. If the key pressed doesn't match any letter, 
  //do nothing, otherwise run the selected key (letter) through the addGuessedLetter function. 
  const handler = (e: KeyboardEvent) => {
    const key = e.key
    

    if (!key.match(/^[a-z]$/)) return

    e.preventDefault() //?
    addGuessedLetter(key)
  }
  //listen for a keypress on the keyboard and call handler function
  document.addEventListener("keypress", handler)

   return () => {
    document.removeEventListener("keypress", handler)
   }
}, [guessedLetters])

//If user presses the enter key, setGuessedLetters will reset to an empty array
//Then setWordToGuess will run the getWord function to get a new word
//thereby resetting to a new game.
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    const key = e.key

    if (key !== "Enter") return

    e.preventDefault()
    setGuessedLetters([])
    setWordToGuess(getWord())
  }

  document.addEventListener("keypress", handler)

   return () => {
    document.removeEventListener("keypress", handler) //
   }
}, [])

  return ( 
    <div 
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center"
      }}>
      <div style={{ fontSize: "2rem", textAlign: "center" }}>{isWinner && "Winner! Refresh to Play Again"}
      {isLoser && "Game Over. Refresh to Play Again"}
      </div>
      <HangmanDrawing numberOfIncorrectGuesses={incorrectLetters.length}/>
      <HangmanWord reveal={isLoser} guessedLetters={guessedLetters} wordToGuess={wordToGuess}/>
      {/* alignSelf: "stretch" overrides the center alignment for the whole app 
      so that the keyboard is laid out in a grid rather than all buttons in a center row.*/}
      <div style={{ alignSelf: "stretch"}}>
        <Keyboard
        disabled= {isWinner || isLoser}
        //activeLetters will determine which letters on the keyboard will have a blue background 
        //to signify correctly guessed. Filter guessed letters array to only include letters 
        //that are also present in the wordToGuess array.
        activeLetters={guessedLetters.filter(letter => wordToGuess.includes(letter)
          )}
          //inactiveLetters will grey out keyboard for letters that are incorrectly guessed
          inactiveLetters= {incorrectLetters}
          addGuessedLetter={addGuessedLetter}
          />
      </div>
    </div>
  )
}

export default App

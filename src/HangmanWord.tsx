type HangmanWordProps = {
    guessedLetters: string[]
    wordToGuess: string
    reveal?: boolean
}

export function HangmanWord( {guessedLetters, wordToGuess, reveal = false }: HangmanWordProps) {
    
    return (
    <div 
        style= {{ 
            display: "flex", 
            gap: ".25em", 
            fontSize: "6rem", 
            fontWeight: "bold", 
            textTransform: "uppercase", 
            fontFamily: "monospace",
            }}>
        {/* Split the word into an array separated by letter, then iterate through each letter. Underline each letter. */}
        {wordToGuess.split("").map((letter, index) => (
            <span style={{ borderBottom: ".1em solid black"}} key={index}>
                {/* If guessed letters string array includes a letter in the wordToGuess string (user has guessed a correct letter) or reveal is true (the game is over), then set visibility of letters to visible, otherwise set to hidden.*/}
                <span style={{
                    visibility: guessedLetters.includes(letter) || reveal 
                    ? "visible" 
                    : "hidden",
                    // if guessed letters does not include the letter (user has not guessed the letter) and reveal is true (game is over), then the letter color is red, otherwise it's black.
                    color: !guessedLetters.includes(letter) && reveal ? "red" : "black"
                    }}>
                        {letter}
                </span>
            </span>
        ))}
    </div>
    )
}
let place = 0
let currLine = 0
let word = ""
const ROWLENGTH = 5

const wordOfTheDayURL = "https://words.dev-apis.com/word-of-the-day"
let freqCharsOfWord = {};
let wordOfTheDay;

async function getWordOfTheDay() {
    const req = await fetch(wordOfTheDayURL);
    const json = await req.json();
    return json
}

async function validateWord() {
    const req = await fetch("https://words.dev-apis.com/validate-word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            word: word
        })
      });
    const json = await req.json();
    return json
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function animate(inputField) {
    inputField.classList.add("animate")
    setTimeout(() => {
        inputField.classList.remove("animate");
    }, 600);
}

function colorInputField(inputField, color) {
    inputField.style.backgroundColor = color;
}

function handleLetter(letter, inputField) {
    let upperLetter = letter.toUpperCase();
    if (word.length < 5) {
        word += upperLetter;
    } else {
        word = word.substring(0, word.length - 1) + upperLetter;
    }
    if (place < ROWLENGTH - 1) {    
        place++;
    }
    inputField.value = upperLetter; 
    animate(inputField);
}

function handleBackspace(inputFields) {
    if (word.length === ROWLENGTH) {
        inputField = inputFields[ROWLENGTH * currLine + place]
    } else if (place > 0) {
        inputField = inputFields[ROWLENGTH * currLine + place - 1]
        place--;
    }
    word = word.substring(0, word.length - 1)
    inputField.value = "";
}

function colorWord(inputFields, word) {
    let temp = Object.assign({}, freqCharsOfWord)

    for (j = 0; j < 5; j++) {
        let currInputField = inputFields[5*currLine + j]
        if (word[j] === wordOfTheDay[j]) {
            colorInputField(currInputField, "green")
            freqCharsOfWord[word[j]]--;
            console.log(freqCharsOfWord)
        }
    }
    for (j = 0; j < 5; j++) {
        let currInputField = inputFields[5*currLine + j]
        if (word[j] in freqCharsOfWord) {
            if (freqCharsOfWord[word[j]] === 0 && word[j] !== wordOfTheDay[j]) {
                colorInputField(currInputField, "grey")
            }
            else if (word[j] !== wordOfTheDay[j]) {
                colorInputField(currInputField, "yellow")
                freqCharsOfWord[word[j]]--;
            }
        }
        else {
            colorInputField(currInputField, "grey")
        }
    }
    freqCharsOfWord = temp
}

function handleEnter(inputFields) {
    if (word.length === ROWLENGTH) {
        if (word === wordOfTheDay) {
            alert("YOU WIN")
        } else if (currLine === 5) {
            alert("YOU LOSE")
        }

        document.getElementById("loadingScreen").style.display = "block";
        document.getElementById("content").style.display = "none";

        validateWord().then(async result => {
            document.getElementById("loadingScreen").style.display = "none";
            document.getElementById("content").style.display = "block";
            if (result.validWord) {
                place = 0;
                colorWord(inputFields, result.word);
                currLine++;
                word = ""
            } else {
                for (j = 0; j < 5; j++) {
                    animate(inputFields[5*currLine + j])
                }
            }
        })
    } else {
        for (j = 0; j < 5; j++) {
            animate(inputFields[5*currLine + j])
        }
    }
}

function init(wordOfTheDay) {
    let inputFields = document.querySelectorAll(".char-input");

    document.addEventListener("keydown", (event) => {
        if (isLetter(event.key)) {
            handleLetter(event.key, inputFields[ROWLENGTH * currLine + place]);
        }
        else if (event.key === "Backspace") {
            handleBackspace(inputFields);
        }
        else if (event.key === "Enter") {
            handleEnter(inputFields);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    getWordOfTheDay().then(result => {
        wordOfTheDay = result.word.toUpperCase();
        for (const char of wordOfTheDay) {
            freqCharsOfWord[char] = (freqCharsOfWord[char] || 0) + 1;
        }
        console.log(wordOfTheDay)
        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("content").style.display = "block";
        init();
    })
});
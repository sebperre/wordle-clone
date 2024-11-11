let place = 0
let currLine = 0
let word = ""
const ROWLENGTH = 5

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function animate(inputField) {
    if (inputField.classList.contains("animate")) {
        inputField.classList.remove('animate');
        setTimeout(() => {
            inputField.classList.add('animate');
        }, 10);
    } else {
        inputField.classList.add('animate');
    } 
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

function handleEnter(inputFields) {
    if (word.length === ROWLENGTH) {
        place = 0;
        currLine++;
    } else {
        for (j = 0; j < 5; j++) {
            animate(inputFields[5*currLine + j])
        }
    }
}

function init() {
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
        console.log(word) 
    });
}

document.addEventListener("DOMContentLoaded", () => {
    init();
});
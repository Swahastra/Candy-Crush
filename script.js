const grid = document.getElementById("grid");
const width = 8;
const candyColors = ["red", "yellow", "orange", "green", "blue", "purple"];
let squares = [];

// Generate the board
function createBoard() {
    for (let i = 0; i < width * width; i++) {
        const square = document.createElement("div");
        square.setAttribute("draggable", true);
        square.setAttribute("id", i);
        let randomColor = Math.floor(Math.random() * candyColors.length);
        square.style.backgroundColor = candyColors[randomColor];
        square.classList.add("candy");
        grid.appendChild(square);
        squares.push(square);

        // Event listeners for drag
        square.addEventListener("dragstart", dragStart);
        square.addEventListener("dragend", dragEnd);
        square.addEventListener("dragover", dragOver);
        square.addEventListener("dragenter", dragEnter);
        square.addEventListener("dragleave", dragLeave);
        square.addEventListener("drop", dragDrop);
    }
}

createBoard();

let colorBeingDragged, colorBeingReplaced, squareIdBeingDragged, squareIdBeingReplaced;

function dragStart() {
    colorBeingDragged = this.style.backgroundColor;
    squareIdBeingDragged = parseInt(this.id);
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    colorBeingReplaced = this.style.backgroundColor;
    squareIdBeingReplaced = parseInt(this.id);
    squares[squareIdBeingDragged].style.backgroundColor = colorBeingReplaced;
    squares[squareIdBeingReplaced].style.backgroundColor = colorBeingDragged;
}

function dragEnd() {
    let validMoves = [
        squareIdBeingDragged - 1,
        squareIdBeingDragged + 1,
        squareIdBeingDragged - width,
        squareIdBeingDragged + width,
    ];

    let validMove = validMoves.includes(squareIdBeingReplaced);

    if (squareIdBeingReplaced && validMove) {
        squareIdBeingReplaced = null;
        checkForMatches();
    } else if (squareIdBeingReplaced && !validMove) {
        // Revert the colors if not a valid move
        squares[squareIdBeingReplaced].style.backgroundColor = colorBeingReplaced;
        squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged;
    } else {
        squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged;
    }

    // Reset values
    colorBeingDragged = null;
    colorBeingReplaced = null;
    squareIdBeingDragged = null;
    squareIdBeingReplaced = null;
}

// Check for matches of three
function checkForMatches() {
    // Check for row of three
    for (let i = 0; i < width * width; i++) {
        let rowOfThree = [i, i + 1, i + 2];
        let decidedColor = squares[i].style.backgroundColor;
        const isBlank = squares[i].style.backgroundColor === "";

        if (rowOfThree.every(index => squares[index] && squares[index].style.backgroundColor === decidedColor && !isBlank)) {
            rowOfThree.forEach(index => {
                squares[index].style.backgroundColor = "";
            });
        }
    }

    // Check for column of three
    for (let i = 0; i < width * (width - 2); i++) {
        let columnOfThree = [i, i + width, i + width * 2];
        let decidedColor = squares[i].style.backgroundColor;
        const isBlank = squares[i].style.backgroundColor === "";

        if (columnOfThree.every(index => squares[index] && squares[index].style.backgroundColor === decidedColor && !isBlank)) {
            columnOfThree.forEach(index => {
                squares[index].style.backgroundColor = "";
            });
        }
    }

    moveCandiesDown();
}

// Let candies drop down
function moveCandiesDown() {
    for (let i = 0; i < width * (width - 1); i++) {
        if (squares[i + width].style.backgroundColor === "") {
            squares[i + width].style.backgroundColor = squares[i].style.backgroundColor;
            squares[i].style.backgroundColor = "";

            const firstRow = Array.from({ length: width }, (_, idx) => idx);
            if (firstRow.includes(i) && squares[i].style.backgroundColor === "") {
                let randomColor = Math.floor(Math.random() * candyColors.length);
                squares[i].style.backgroundColor = candyColors[randomColor];
            }
        }
    }
}

// Continuously check for matches
window.setInterval(function () {
    checkForMatches();
}, 100);
      

const board = document.getElementById("gameBoard");
const statusText = document.getElementById("status");
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

let currentPlayer = "X";
let gameActive = true;
let cells = ["", "", "", "", "", "", "", "", ""];
let mode = "player";
let scores = { X: 0, O: 0 };

document.querySelectorAll('input[name="mode"]').forEach(input => {
  input.addEventListener("change", (e) => {
    mode = e.target.value;
    resetGame();
  });
});

function renderBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.textContent = cell;
    cellDiv.addEventListener("click", () => handleCellClick(index));
    board.appendChild(cellDiv);
  });
}

function handleCellClick(index) {
  if (!gameActive || cells[index] !== "") return;

  clickSound.play();
  cells[index] = currentPlayer;
  renderBoard();
  if (checkWinner()) {
    statusText.textContent = `اللاعب ${currentPlayer} فاز!`;
    scores[currentPlayer]++;
    updateScores();
    gameActive = false;
    winSound.play();
    return;
  }

  if (!cells.includes("")) {
    statusText.textContent = "تعادل!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `الدور على: ${currentPlayer}`;

  if (mode === "ai" && currentPlayer === "O") {
    setTimeout(makeAIMove, 500);
  }
}

function makeAIMove() {
  let emptyIndexes = cells
    .map((cell, idx) => (cell === "" ? idx : null))
    .filter(idx => idx !== null);

  let choice = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  handleCellClick(choice);
}

function checkWinner() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
  });
}

function resetGame() {
  currentPlayer = "X";
  gameActive = true;
  cells = ["", "", "", "", "", "", "", "", ""];
  statusText.textContent = `الدور على: ${currentPlayer}`;
  renderBoard();
}

function updateScores() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
}

renderBoard();

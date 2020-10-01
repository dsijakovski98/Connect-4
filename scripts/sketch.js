let w;
let h;
let cols;
let rows;
let gameBoard;
let columns;
let podSize;
let highestRow;
let player;
let mainDiagonals;
let secondaryDiagonals;
let gameOver;
let currentColumns = 7;
let state = "pregame";
let winner;
let slots;
let minRange = 0.5;
let maxRange = 1;
let offense = 0.5;
let defense = 90;
let maxDepth = 4;
let think;

// *********************************** //
// *******                     ******* //
// ***     SCORES LOOKUP TABLE     *** //
// *******                     ******* //
// *********************************** //
let scores = {
  player: 100000,
  ai: -100000,
};
// *********************************** //
// *******                     ******* //
// ***     SCORES LOOKUP TABLE     *** //
// *******                     ******* //
// *********************************** //

// HTML buttons event listeners setup
function setupJS() {
  var winnerLeft = document.getElementById("winnerLeft");
  winnerLeft.innerHTML = "";
  var winnerRight = document.getElementById("winnerRight");
  winnerRight.innerHTML = "";

  var resetButton = document.getElementById("reset");
  resetButton.addEventListener("click", () => {
    resetGame();
  });

  var menu = document.querySelector(".mainMenu");

  var pvpButton = document.getElementById("PvP");
  pvpButton.addEventListener("click", () => {
    menu.style.display = "none";
    state = "2players";
  });

  // var aiButton = document.getElementById("AI");
  // aiButton.addEventListener("click", () => {
  //   menu.style.display = "none";
  //   state = '1player';
  // });

  var newGameButton = document.getElementById("newGame");
  newGameButton.addEventListener("click", () => {
    state = "pregame";
    menu.style.display = "block";
    resetGame();
  });

  var col7 = document.getElementById("col7");
  col7.addEventListener("click", () => {
    currentColumns = 7;
    resetGame();
  });

  var col8 = document.getElementById("col8");
  col8.addEventListener("click", () => {
    currentColumns = 8;
    resetGame();
  });

  var col9 = document.getElementById("col9");
  col9.addEventListener("click", () => {
    currentColumns = 9;
    resetGame();
  });

  var col10 = document.getElementById("col10");
  col10.addEventListener("click", () => {
    currentColumns = 10;
    resetGame();
  });
}

// Setting the number of columns for each new game
function setColumns(n) {
  cols = n;
  return n;
}

function resetGame() {
  player = true;
  loop();
  setup();
}

// Starting game setup
function setup() {
  think = document.getElementById("think");
  // think.style.display = "none";
  setupJS();

  // Basic game variables setup
  // expand for details
  {
    createCanvas(500, 500);
    gameOver = false;
    columns = [];
    mainDiagonals = [];
    secondaryDiagonals = [];
    player = true;
    highestRow = -Infinity;
    cols = setColumns(currentColumns);
    rows = cols;
    slots = cols;
    w = width / cols;
    podSize = w / 2;
    winner = "";
  }

  // Creating the columns for the board
  for (let i = 0; i < cols; i++) {
    let column = new Column(i * w, 0, w, slots, rows);
    columns.push(column);
  }

  setMainDiagonals();
  setSecondaryDiagonals();

  gameBoard = new Board(columns, highestRow);
}

// Drawing the board
function draw() {
  background(245, 245, 220);

  if (state != "pregame") {
    for (let column of gameBoard.columns) {
      column.checkHover();
      column.show();
    }
  }
} // end draw

function mousePressed() {
  // If the game has started
  if (gameOver == false && state != "pregame") {
    // 2 players mode
    if (state == "2players") {
      makeMove(gameBoard, null);
      player = !player;
    }

    // Player vs AI mode
    else if (state == "1player") {
      // Player makes move

      if (makeMove(gameBoard, null)) {
        // setStyle();
        player = !player;

        // AI makes move
        while (!AIMove()) {
          // setStyle();
          minRange -= 0.01;
          maxRange += 0.01;
        }
        player = !player;
      }

      // setTimeout(()=>{
      //   think.style.visibility = "hidden";
      // }, 500);
    }
  }
} // end function mousePressed

function keyPressed() {
  if (keyCode === 82) {
    // PRESS 'R' TO RESET GAME
    resetGame();
  }
  if (key == "t") {
    //testing
  }
}

function makeMove(board, columnSelect = null) {
  let columnSelected;

  if (columnSelect == null) {
    columnSelected = floor(mouseX / w);
  } else {
    columnSelected = columnSelect;
  }

  // If it is a valid column
  if (columnSelected >= 0 && columnSelected < cols) {
    let c = board.columns[columnSelected];

    // If there is room in that column
    if (c.available > 0) {
      addPod(board, c);
      winner = checkWinner(board, true);
      return true;
    } // available if end
    else {
      return false;
    }
  } // valid column if end
} // makeMove function end

async function setStyle() {
  // console.log("TEST TEST TEST");
  think.style.visibility = "visible";
}

function AIMove() {
  let bestScore = +Infinity;
  let bestIndex = 0;

  let i = 0;

  // For every next board state
  for (let nextState of generateNextStates(gameBoard)) {
    // First check for winner

    // Get the score for that state
    let score = minimaxAlphaBeta(
      nextState,
      false,
      maxDepth,
      -Infinity,
      +Infinity
    );

    let w = checkWinner(nextState, false);

    if (w == "ai") {
      score -= 10000000;
    }

    console.log("STATE " + i + " ", nextState);
    console.log("STATE SCORE ", score);

    // If it is the best score
    if (score < bestScore) {
      // console.log("WINNING INDEX : ", );

      // Make it the best score
      bestScore = score;
      bestIndex = i;
    }

    i++;
  }

  console.log("");
  console.log("*** BEST SCORE IS " + bestScore + " ***");
  console.log("*** BEST MOVE IS TO COLUMN " + bestIndex + " ***");
  console.log("");

  // Make the best move possible
  if (makeMove(gameBoard, bestIndex)) {
    // think.style.display = "none";
    return true;
  } else {
    return false;
  }
}

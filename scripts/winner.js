function checkWinner(board, game) {
  let winningPlayer = '';
  
  // VERTICAL CHECK
  let vResults = checkVerticalWinner(board, game, winningPlayer);
  // vResults[0] => boolean - is there a winner or not ?
  // vResults[1] => string - the name of the winner ( 'player' or 'ai' )

  // if there is a vertical winner
  if (vResults[0]) {
    // return the name of the winner
    return vResults[1];
  }
  
  winningPlayer = '';

  // HORIZONTAL CHECK
  let hResults = checkHorizontalWinner(board, game, winningPlayer);
  // hResults[0] => boolean - is there a winner or not ?
  // hResults[1] => string - the name of the winner ( 'player' or 'ai' )

  // if there is a horizontal winner
  if (hResults[0]) {
    // return the name of the winner
    return hResults[1];
  }

  winningPlayer = '';
  
  // DIAGONAL CHECK
  let dResults = checkDiagonalWinner(board, game, winningPlayer);
  // dResults[0] => boolean - is there a winner or not ?
  // dResults[1] => string - the name of the winner ( 'player' or 'ai' )
  
  // if there is a diagonal winner 
  if(dResults[0]){
    // return the name of the winner
    return dResults[1];
  }


  // if there is no winner, return empty string
  return '';
  
}


// CHECKS FOR A VERTICAL WINNER
function checkVerticalWinner(board, game, winningPlayer) {

  // check every column
  for (let i = 0; i < cols; i++) {

    // if the column has more than 3 pods in it -> it might have a winner in it
    if (board.columns[i].pods.length > 3) {

      // if it has a winner in it
      if (hasVerticalWinner(board.columns[i])) {
      
        winningPlayer =  player ? 'player' : 'ai';
        
        if(game){
          gotWinner(winningPlayer);
          revealWinner(i, null, null);
        }
      
        return [true, winningPlayer];

      } // hasVerticalWinner if end
    
    } // has more than 3 pods if end

  } // for every column loop end

  return [false, ''];
}


// CHECKS WHETHER A COLUMN HAS A VERTICAL WINNER
function hasVerticalWinner(column){

      // check every 4 neighbouring pods
      for (let i = 0; i < column.pods.length - 3; i++) {

        if ( equals4(column.pods[i].player, column.pods[i + 1].player, 
            column.pods[i + 2].player, column.pods[i + 3].player) ){
          
          // this variable is needed for highlighting the winning pods
          column.winningIndex = i;

          return true;

        } // equals4 if end

      } // for every 4 neighbouring pods loop end
      
      return false;
} 


// CHECKS FOR A HORIZONTAL WINNER
function checkHorizontalWinner(board, game, winningPlayer) {

  // check every row up to the highest row that a pod has been placed in
  for (let row = 0; row < rows - board.highestRow + 1; row++) {

    // check every 4 neighbouring columns in that row
    for (let i = 0; i < board.columns.length - 3; i++) {

      if ( exist4(board.columns[i].pods[row], board.columns[i + 1].pods[row],
        board.columns[i + 2].pods[row], board.columns[i + 3].pods[row]) ) {

        if ( equals4(board.columns[i].pods[row].player, board.columns[i + 1].pods[row].player, 
            board.columns[i + 2].pods[row].player,board.columns[i + 3].pods[row].player) ) {
              
            winningPlayer =  player ? 'player' : 'ai';

            if(game){
              gotWinner(winningPlayer);
              revealWinner(null, i, row);
            }
              
            return [true, winningPlayer];

        } // equals4 if end

      } // exist4 if end 

    } // for every 4 neighbouring columns loop end

  } // for every row up to highest row loop end

  return [false, ''];
}


// CHECKS FOR A DIAGONAL WINNER
function checkDiagonalWinner(board, game, winningPlayer) {
  // CHECK MAIN & SECONDARY DIAGONALS
  
  let mdResults = checkDiagonals(board, mainDiagonals, game, winningPlayer);
  // mdResults[0] => boolean - is there a winner or not ?
  // mdResults[1] => string - the name of the winner ( 'player' or 'ai' )

  if(mdResults[0]){
    return mdResults;
  }


  let sdResults = checkDiagonals(board, secondaryDiagonals, game, winningPlayer);
  // sdResults[0] => boolean - is there a winner or not ?
  // sdResults[1] => string - the name of the winner ( 'player' or 'ai' )
  
  if(sdResults[0]){
    return sdResults;
  }


  // if there is no winner, return an empty string
  return [false,''];
}


// CHECKS MAIN/SECONDARY DIAGONALS FOR A WINNER
function checkDiagonals(board, diagonals, game, winningPlayer) {

    // Go through every diagonal
    for (let diagonal of diagonals) {
      
      // If that diagonal is valid
      if (isValid(board, diagonal)) {

        // Go through every 4 neighbouring pods and check if they are equal 
        for (let i = 0; i < diagonal.length - 3; i++) {
          
          if (exist4(board.columns[diagonal[i].col].pods[diagonal[i].row],
            board.columns[diagonal[i + 1].col].pods[diagonal[i + 1].row],
            board.columns[diagonal[i + 2].col].pods[diagonal[i + 2].row],
            board.columns[diagonal[i + 3].col].pods[diagonal[i + 3].row])) {
              
            if (equals4(board.columns[diagonal[i].col].pods[diagonal[i].row].player,
              board.columns[diagonal[i + 1].col].pods[diagonal[i + 1].row].player,
              board.columns[diagonal[i + 2].col].pods[diagonal[i + 2].row].player,
              board.columns[diagonal[i + 3].col].pods[diagonal[i + 3].row].player)) {
          
                
                winningPlayer =  player ? 'player' : 'ai';
                if(game){
                  gotWinner(winningPlayer);
                  revealDiagonalWinner(diagonal, i);
                  }
            
                  return [true, winningPlayer];

          } // equals4 if end

        } // exist4 if end
        
      } // for every 4 neighbouring pods loop end

    } // isValid if end
      
    } // for every diagonal if end

    return [false, ''];
}


// RETURNS WHETHER A DIAGONAL IS VALID 
// ( DOES IT HAVE ENOUGH PODS [number of pods >= 4] IN IT TO HAVE A WINNER )
function isValid(board, diagonal) {
  let count = 0;
  for (let i = 0; i < diagonal.length; i++) {
    if (board.columns[diagonal[i].col].pods[diagonal[i].row] != null) {
      count++;
    }
  }

  return count >= 4;
}


// SETS THE MAIN DIAGONALS OF THE BOARD
// CALLED ONLY ONCE AT BEGINNING OF THE GAME
function setMainDiagonals() {

  for (let row = rows - 4; row > 0; row--) {
    let r = row;
    let diagonal = [];
    for (let col = 0; r < rows; col++, r++) {
      coordinates = {
        row: r,
        col: col
      };
      diagonal.push(coordinates);
    }
    mainDiagonals.push(diagonal);
  }

  //main diagonal
  let md = [];
  for (let row = 0; row < cols; row++) {
    for (let col = 0; col < cols; col++) {

      if (row == col) {
        coordinates = {
          row: row,
          col: col
        };
        md.push(coordinates);
      }

    }
  }
  mainDiagonals.push(md);

  for (let row = 3; row < cols - 1; row++) {
    let r = row;
    let diagonal = [];
    for (let col = cols - 1; r >= 0; col--, r--) {
      coordinates = {
        row: r,
        col: col
      };
      diagonal.push(coordinates);
    }
    mainDiagonals.push(diagonal);
  }
  // console.log(mainDiagonals)
}


// SETS THE SECONDARY DIAGONALS OF THE BOARD
// CALLED ONLY ONCE AT THE BEGINNING OF THE GAME
function setSecondaryDiagonals() {

  for (let row = 3; row < cols - 1; row++) {
    let r = row;
    let diagonal = [];
    for (let col = 0; r >= 0; col++, r--) {
      coordinates = {
        row: r,
        col: col
      };
      diagonal.push(coordinates);
    }
    secondaryDiagonals.push(diagonal);
  }

  // secondary diagonal
  let sd = [];
  for (let row = 0; row < cols; row++) {
    for (let col = 0; col < cols; col++) {
      if (row + col == cols - 1) {
        coordinates = {
          row: row,
          col: col
        };
        sd.push(coordinates);
      }
    }
  }
  secondaryDiagonals.push(sd);


  for (let row = 1; row < cols - 3; row++) {
    let r = row;
    let diagonal = [];
    for (let col = cols - 1; r < cols; col--, r++) {
      coordinates = {
        row: r,
        col: col
      };
      diagonal.push(coordinates);
    }
    secondaryDiagonals.push(diagonal);
  }
  // return secondaryDiagonals;
}


// HIGHLIGHTS THE WINNING PODS:
//  INDEX -> VERTICAL WINNER
//  I, J -> HORIZONTAL WINNER
function revealWinner(index = null, i = null, j = null) {

  if(index != null){
    // VERTICAL WINNER
    
    let start = gameBoard.columns[index].winningIndex;
    let end = start + 4;

    for(let x = start; x < end; x++){
      gameBoard.columns[index].pods[x].str = color(140);
    }

    return;

  } // Vertical winner if end
 
  if(i != null && j != null){
    // HORIZONTAL WINNER

    for(let x = i; x < i + 4; x++){
      gameBoard.columns[x].pods[j].str = color(120);
    }

    return;

  } // Horizontal winner if end

}

// HIGHLIGHTS THE WINNING PODS:
// DIAGONAL -> ARRAY IN WHICH THERE IS A WINNER
// INDEX -> STARTING INDEX
function revealDiagonalWinner(diagonal, index) {
  
  let start = index;
  let end = start + 4;

  for(let x = start; x < end; x++){
    gameBoard.columns[diagonal[x].col].pods[diagonal[x].row].str = color(140);
  }

}


// ENDS GAME
function gotWinner(winningPlayer) {
  
  // set the MAIN winner to the winning player
  winner = winningPlayer;

  if(winningPlayer == 'ai') {
    winningPlayerName = 'PLAYER 2';
    winnerRight.innerHTML = `${winningPlayerName} WINS !`;
    winnerLeft.innerHTML = "Player 1 loses.";
  } 
  else if(winningPlayer == 'player'){
    winningPlayerName = 'PLAYER 1';
    winnerLeft.innerHTML = `${winningPlayerName} WINS !`;
    winnerRight.innerHTML = "Player 2 loses.";
  }

  gameOver = true;
  noLoop();
}
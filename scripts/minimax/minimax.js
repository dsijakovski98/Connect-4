
// *********************************** //
// *******                     ******* //
// *** SCORING SYSTEM LOOKUP TABLE *** //
// *******                     ******* //
// *********************************** //
let scoring = {

    center:             1,
    
    twoInRow:           0.5,
    twoInARow:          1.5,
    
    threeInRow:         3,
    threeInARow:        3.5,
    
    win:                1000,
    oppWinPrevented:    1000,

    oppCheckMate: 9999,
    
}
// *********************************** //
// *******                     ******* //
// *** SCORING SYSTEM LOOKUP TABLE *** //
// *******                     ******* //
// *********************************** //


// MINIMAX FUNCTION
// WITH ALPHA BETA PRUNING 
function minimaxAlphaBeta(board, isMaximizing, depth, alpha, beta) {
    
    // TERMINAL CASE
    if( depth == 0 || checkGameOver(board) ){
        return evaluateBoard(board, isMaximizing);
    }

    // HUMAN player code
    if(isMaximizing){

        let maxScore = -Infinity;
        let score;

        for(let nextState of generateNextStates(board)){
            
            score = minimaxAlphaBeta(nextState, false, depth - 1, alpha, beta);
            
            maxScore = max(score, maxScore);

            // ALPHA BETA PRUNING CODE
            alpha = max(alpha, score);
            if(beta <= alpha){
                break;
            }

        }

        return maxScore;
    }

    // AI player code
    else {

        let minScore = +Infinity;
        let score;

        for(let nextState of generateNextStates(board)){

            score = minimaxAlphaBeta(nextState, true, depth - 1, alpha, beta);

            minScore = min(score, minScore);

            // ALPHA BETA PRUNING CODE
            beta = min(beta, score);
            if(beta <= alpha){
                break;
            }

        }

        return minScore;
    }

}


// BOARD EVALUATION FUNCTION
function evaluateBoard(board, isMaximizing) {

    let score = 0;
    let currentPlayer;
    let opponent;

    // 1. Who is the current player, who is his opponent
    if(isMaximizing){
        currentPlayer = 1;
        opponent = 2;
    }
    else{
        currentPlayer = 2;
        opponent = 1;
    }
    

    // 2. Scoring
        
    if(isMaximizing){
        // OFFENSE
        score = offenseScore(1, board, currentPlayer);
        // DEFENSE
        score -= defenseScore(board, opponent);
    }
    else{
        // OFFENSE
        score = offenseScore(-1, board, currentPlayer);
        // DEFENSE
        score -= defenseScore(board, opponent);
    }

    return score;
}


// Offense score calculation
function offenseScore(sign, board, currentPlayer){
    let scr = 0;
    let verticalWeight = 1; // random(minRange, maxRange) + 1;
    let horizontalWeight = 1; // random(minRange, maxRange) + 1;
    let diagonalWeight = 1; //random(minRange, maxRange) + 1;

    // center column
    scr += checkCenter(board, currentPlayer);


    // vertical pods 2
    scr += verticalPods(board, currentPlayer, 2) * verticalWeight;
    // vertival consecutives 2
    scr += verticalConsecutive2(board, currentPlayer) * verticalWeight;
    
    // vertical pods 3
    scr += verticalPods(board, currentPlayer, 3) * verticalWeight;
    // vertival consecutives 3
    scr += verticalConsecutive3(board, currentPlayer) * verticalWeight;
    

    // horizontal pods 2
    scr += horizontalPods(board, currentPlayer, 2) * horizontalWeight;
    // horizontal consecutives 2
    scr += horizontalConsecutive2(board, currentPlayer) * horizontalWeight;
    
    // horizontal pods 3
    scr += horizontalPods(board, currentPlayer, 3) * horizontalWeight;
    // horizontal consecutives 3
    scr += horizontalConsecutive3(board, currentPlayer) * horizontalWeight;
    
    
    // diagonal pods MD-2
    scr += diagonalPods(board, currentPlayer, 2, mainDiagonals) * diagonalWeight;
    // diagonal pods MD-3
    scr += diagonalPods(board, currentPlayer, 3, mainDiagonals) * diagonalWeight;
    // diagnal consecutives MD-2
    scr += diagonalConsecutive2(board, currentPlayer, mainDiagonals) * diagonalWeight;
    // diagonal consecutives MD-3
    scr += diagonalConsecutive3(board, currentPlayer, mainDiagonals) * diagonalWeight;

    // diagonal pods SD-2
    scr += diagonalPods(board, currentPlayer, 2, secondaryDiagonals) * diagonalWeight;
    // diagonal pods SD-3
    scr += diagonalPods(board, currentPlayer, 3, secondaryDiagonals) * diagonalWeight;
    // diagnal consecutives SD-2
    scr += diagonalConsecutive2(board, currentPlayer, secondaryDiagonals) * diagonalWeight;
    // diagonal consecutives SD-3
    scr += diagonalConsecutive3(board, currentPlayer, secondaryDiagonals) * diagonalWeight;

    return scr * sign * offense;
}

// Defense score calculation
function defenseScore(board, opponent){
    let scr = 0;
    // let verticalWeight = random(minRange, maxRange) + 1;
    // let horizontalWeight = random(minRange, maxRange) + 1;
    // let diagonalWeight = random(minRange, maxRange) + 1;


    // Check if AI has prevented a win
    if(winPrevented('v', board, opponent)){
        scr += scoring['oppWinPrevented'] * defense;
    }
    if(winPrevented('h1', board, opponent)){
        scr += scoring['oppWinPrevented'];
        
        if(winPrevented('h2', board, opponent)){
            scr += scoring['oppWinPrevented'] * defense * 10;
        }
        else{
            scr -= scoring['oppWinPrevented'] * defense * 10;
        }
    }
    else if(winPrevented('h2', board, opponent)){
        scr += scoring['oppWinPrevented'] * defense * 10;
    }
    
    if(winPrevented('altH', board, opponent)){
        scr += scoring['oppWinPrevented'] * defense;
    }
    if(winPrevented('dm', board, opponent)){
        scr += scoring['oppWinPrevented'] * defense;
    }
    // if(winPrevented('altDM', board, opponent)){
    //     scr += scoring['oppWinPrevented'] * defense;
    // }
    // if(winPrevented('altDS', board, opponent)){
    //     scr += scoring['oppWinPrevented'] * defense;
    // }
    if(winPrevented('ds', board, opponent)){
        scr += scoring['oppWinPrevented'] * defense;
    }

    // Check if opponent is about to win
    // if(aboutToWin('v', board, opponent)){
    //     scr -= scoring['oppWinPrevented'];
    // }
    // if(aboutToWin('h', board, opponent)){
    //     scr -= scoring['oppWinPrevented'];
    // }
    // if(aboutToWin('altH', board, opponent)){
    //     scr -= scoring['oppWinPrevented'];
    // }
    // if(aboutToWin('dm', board, opponent)){
    //     scr -= scoring['oppWinPrevented'];
    // }
    // if(aboutToWin('ds', board, opponent)){
    //     scr -= scoring['oppWinPrevented'];
    // }
    

    if(opponentCheckMate(board, opponent)){
        scr -= scoring['oppCheckMate'] * defense;
    }



    let opponentOffenseScore = 0;
    // Calculate the opponent score
    opponentOffenseScore += verticalConsecutive2(board, opponent);
    opponentOffenseScore += verticalConsecutive3(board, opponent);
    opponentOffenseScore += horizontalConsecutive2(board, opponent);
    opponentOffenseScore += horizontalConsecutive3(board, opponent);
    opponentOffenseScore += diagonalConsecutive2(board, opponent, mainDiagonals);
    opponentOffenseScore += diagonalConsecutive3(board, opponent, mainDiagonals);

    scr -= opponentOffenseScore;

    return scr * defense;
}







// *********************************** //
// *******                     ******* //
// ***       HELP FUNCTIONS        *** //
// *******                     ******* //
//   *******************************   // 
       // ********************* //
             // ********* //
                // *** //
                 // * //

// FUNCTION THAT GENERATES NEXT STATES FROM A GIVEN BOARD
function generateNextStates(board) {

    let newStates = [];

    // For every column on the board
    for(let i = 0; i < cols; i++){

        // Make a copy of the board
        dummyBoard = JSON.parse(JSON.stringify(board));

        // If there is an available spot in that column
        if(dummyBoard.columns[i].available > 0){
    
            addPod(dummyBoard, dummyBoard.columns[i]);
            newStates.push(dummyBoard);

        } // available if end

    } // for every column loop end

    return newStates;
}

// FUNCTION THAT CHECKS IF THE GAME IS OVER (TIED)
function checkGameOver(board) {

    let goFlag = true;
    for(let i = 0; i < cols; i++){
        if(board.columns[i].available > 0){
            goFlag = false;
        }
    }
    if(goFlag && winner == ''){
        return true;
    }
    return false;
}

// ADDS POD TO THE COLUMN [col] IN [board]
function addPod(board, col) {

    // Creation of pod
    podX = col.x + col.w / 2;
    podY = col.offset * col.available - col.offset / 2;
    
    let podColor;
    
    if (player) {
      podColor = color(255, 0, 0);
    } else {
      podColor = color(35);
    }
    playerNum = player ? 1 : 2;
  
    // Pod created
    let pod = new Pod(playerNum, podX, podY, podSize, podColor);
    
    col.pods.push(pod);
    board.highestRow = max(cols - col.available + 1, highestRow);
    col.available -= 1;
}

// RETURNS WHETHER 3 VALUES ARE EQUAL TO EACHOTHER
function equals3(el_1, el_2, el_3){
    return ( (el_1 == el_2) && (el_2 == el_3) );
}
  
// RETURNS WHETHER 4 VALUES ARE EQUAL TO EACHOTHER
function equals4(el_1, el_2, el_3, el_4){
    return ( (el_1 == el_2) && (el_2 == el_3) && (el_3 == el_4) );
}
  
// RETURNS WHETHER 4 THINGS/ELEMENTS EXIST
function exist4(el_1, el_2, el_3, el_4){
    return el_1 && el_2 && el_3 && el_4;
}

// RETURNS AN ARRAY OF THE PODS' PLAYER ATTRIBUTES FROM ROW [index] OF THE [board]
function getRow(board, index){
    let boardRow = [];

    // For every column of the board
    for(let i = 0; i < cols; i++){

        // If there is a pod at that place -> add its player attribute (1 or 2)
        if(board.columns[i].pods[index] != null){
            boardRow.push( board.columns[i].pods[index].player );
        }
        else{
            boardRow.push(-1);
        }
    }

    return boardRow;
}

// RETURNS AN ARRAY OF THE PODS' PLAYER ATTRIBUTES FROM THE BOARD [board] IN THE DIAGONAL [diagonal]
function getPodsFromDiagonal(board, diagonal){

    let podsRow = [];

    // For every coordinate in the diagonal
    for(let i = 0; i < diagonal.length; i++){
        
        let col = diagonal[i].col;
        let row = diagonal[i].row;

        if(board.columns[col].pods[row] != null){
            podsRow.push(board.columns[col].pods[row].player);
        }
        else{
            podsRow.push(-1);
        }

    }

    return podsRow;
}
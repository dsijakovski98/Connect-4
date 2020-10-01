// OFFENSIVE FUNCTIONS

    //CENTER

    // Checks if there is an AI pod in the center
    function checkCenter(board, currentPlayer){
        
        let centerScore = 0;
        let centerIndex = floor((cols - 1) / 2);
        let c = board.columns[centerIndex];
        
        // If there are some pods in the column
        if(c.pods.length > 0){
        
            // For every pod in the middle column
            for(let i = 0; i < c.pods.length; i++){
                
                // If there is a current player - type pod
                if(c.pods[i].player == currentPlayer){
                    centerScore += scoring['center'];
                }
                
            }
            
        }

        return centerScore;
    }



    //VERTICAL

    // Checks if there are N+ pods on the board VERTICALLY
    function verticalPods(board, currentPlayer, N){
        let vertPods = 0;
        let vertScore = 0;
        let vert = N == 2 ? 'twoInRow' : 'threeInRow';

        // For every column on the board
        for(let i = 0; i < cols; i++){

            vertPods = 0;
            let c = board.columns[i];

            // For every pod in the column
            for(let j = 0; j < c.pods.length; j++){
                
                // If there is a current player - type pod in it
                if(c.pods[j].player == currentPlayer){
                    vertPods ++;
                }

            }

            // If there were N+ pods in that column
            if(vertPods >= N){
                    vertScore += scoring[vert];
            }

        }

        return vertScore;
    }

    // Checks if there are 2 consecutive pods on the board VERTICALLY 
    function verticalConsecutive2(board, currentPlayer){
        let consPods = 0;

        // For every column on the board
        for(let i = 0; i < cols; i++){

            let c = board.columns[i];

            // Check every consecutive pods
            for(let j = 0; j < c.pods.length - 1; j++){
                if( equals3(c.pods[j].player, c.pods[j + 1].player, currentPlayer) ){
                    consPods += scoring['twoInARow'];
                }
            }

        }

        return consPods;
    }

    // Checks if there are 3 consecutive pods on the board VERTICALLY 
    function verticalConsecutive3(board, currentPlayer){
        let consPods = 0;

        // For every column on the board
        for(let i = 0; i < cols; i++){

            let c = board.columns[i];

            // Check every consecutive pods
            for(let j = 0; j < c.pods.length - 2; j++){
                if( equals4(c.pods[j].player, c.pods[j+1].player, c.pods[j+2].player, currentPlayer) ){
                    consPods += scoring['threeInARow'];
                }
            }

        }

        return consPods;
    }



    // HORIZONTAL

    // Checks if there are N+ pods on the board HORIZONTALLY
    function horizontalPods(board, currentPlayer, N){
        let horPods = 0;
        let horScore = 0;
        let horizont = (N == 2) ? 'twoInRow' : 'threeInRow';

        // For every row on the board
        for(let i = 0; i < rows; i++){

            horPods = 0;
            let podsRow = getRow(board, i);
            // console.log("PODS ROW: ", podsRow);
            // For every pod in the row
            for(let j = 0; j < podsRow.length; j++){
                
                // If there is a current player - type pod in it
                if(podsRow[j] == currentPlayer){
                    horPods ++;
                }

            }

            // If there were N+ pods in that column
            if(horPods >= N){
                    horScore += scoring[horizont];
            }

        }

        return horScore;
    }


    // Checks if there are 2 consecutive pods on the board HORIZONTALLY 
    function horizontalConsecutive2(board, currentPlayer){
        let horPods = 0;

        // For every column on the board
        for(let i = 0; i < cols; i++){

            let rowPods = getRow(board, i);

            // Check every consecutive pods
            for(let j = 0; j < rowPods.length - 1; j++){

                if( equals3(rowPods[j], rowPods[j + 1], currentPlayer) ){
                    horPods += scoring['twoInARow'];
                }

            }

        }

        return horPods;
    }


    // Checks if there are 3 consecutive pods on the board HORIZONTALLY 
    function horizontalConsecutive3(board, currentPlayer){
        let horPods = 0;

        // For every column on the board
        for(let i = 0; i < cols; i++){

            let rowPods = getRow(board, i);

            // Check every consecutive pods pair
            for(let j = 0; j < rowPods.length - 2; j++){

                if( equals4(rowPods[j], rowPods[j + 1], rowPods[j + 2], currentPlayer) ){
                    horPods += scoring['threeInARow'];
                }

            }

        }

        return horPods;
    }



    // DIAGONAL

    // Checks if there are N+ pods on the board DIAGONALLY
    function diagonalPods(board, currentPlayer, N, diagonals){
        let diagonalPods = 0;
        let diagonalScore = 0;
        let diag = (N == 2) ? 'twoInRow' : 'threeInRow';

        // For every diagonal
        for(let diagonal of diagonals){

            diagonalPods = 0;
            let dRow = getPodsFromDiagonal(board, diagonal);

            // For every pod in the diagonal
            for(let j = 0; j < dRow.length; j++){
                
                // If there is a current player - type pod in it
                if(dRow[j] == currentPlayer){
                    diagonalPods ++;
                }

            }

            // If there were N+ pods in that column
            if(diagonalPods >= N){
                diagonalScore += scoring[diag];
            }

        }

        return diagonalScore;
    }

    // Checks if there are 2 consecutive pods on the board DIAGONALLY
    function diagonalConsecutive2(board, currentPlayer, diagonals){
        let diagonalPods = 0;

        // For every diagonal
        for(let diagonal of diagonals){

            let dPods = getPodsFromDiagonal(board, diagonal);

            // Check every consecutive pods pair
            for(let j = 0; j < dPods.length - 1; j++){

                if( equals3(dPods[j], dPods[j + 1], currentPlayer) ){
                    diagonalPods += scoring['twoInARow'];
                }

            }

        }

        return diagonalPods;
    }

    // Checks if there are 3 consecutive pods on the board DIAGONALLY
    function diagonalConsecutive3(board, currentPlayer, diagonals){
        let diagonalPods = 0;

        // For every diagonal
        for(let diagonal of diagonals){

            let dPods = getPodsFromDiagonal(board, diagonal);

            // Check every consecutive pods pair
            for(let j = 0; j < dPods.length - 2; j++){

                if( equals4(dPods[j], dPods[j + 1], dPods[j + 2], currentPlayer) ){
                    diagonalPods += scoring['threeInARow'];
                }

            }

        }

        return diagonalPods;
    }

// ================================================================= //

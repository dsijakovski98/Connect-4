
// DEFENSIVE FUNCTIONS

    // CHECKS IF A WIN WAS PREVENTED
    function winPrevented(mode, board, opponent){
        if(mode == 'v'){
            // check if vertical win prevented
            return checkVerticalWinPrevented(board, opponent);
        }
        else if(mode == 'h1'){
            // check if horizontal win BEFORE prevented
            return checkHorizontalWinPrevented(board, opponent, 'before');
        }
        else if(mode == 'h2'){
            // check if horizontal win AFTER prevented
            return checkHorizontalWinPrevented(board, opponent, 'after');
        }
        else if(mode == 'altH'){
            // check if alternative horizontal win prevented
            return checkAlternativeHorizontalWinPrevented(board, opponent);
        }
        else if(mode == 'dm'){
            // check if diagonal win prevented
            // main diagonals
            return checkDiagonalWinPrevented(board, opponent, mainDiagonals);
        }
        else if(mode == 'ds'){
            // check if vertical win prevented
            // secondary diagonals
            return checkDiagonalWinPrevented(board, opponent, secondaryDiagonals);
        }
    }


    // Checks if a vertical win was prevented
    function checkVerticalWinPrevented(board, opponent){

        // For every column of the board
        for(let i = 0; i < cols; i++){

            let c = board.columns[i];

            // If there are +3 pods in the column (AKA a win is prevenable)
            if(c.pods.length > 3){

                // Check every 4 n=consecutive pods
                for(let j = 0; j < c.pods.length - 4; j++){

                    // If the first 3 are opponent - type pods
                    if( equals4(c.pods[j].player, c.pods[j + 1].player,
                        c.pods[j + 2].player, opponent) ){
                            
                            // And if the fourth is a current player- type pod
                            if(c.pods[j + 3].player != opponent){
                                return true;

                            } // last pod if end

                        } // three consecutive pods if end

                } // four consecutive pods loop end

            } // pods length > 3 if end

        } // every column loop end

        return false;
    }

    // Checks if a horizontal win was prevented
    function checkHorizontalWinPrevented(board, opponent, mode){

        // For every row of the board
        for(let i = 0; i < board.highestRow; i++){

            let rowPods = getRow(board, i);

            // Check every three consecutive pods 
            for(let j = 1; j < rowPods.length - 3; j++){

                // If any three consecutive pairs match
                if( equals4(rowPods[j], rowPods[j + 1], rowPods[j + 2], opponent) ){
                    

                    if(mode == 'before'){

                        let beforeIndex = j -1;
                        if(rowPods[beforeIndex] != opponent && rowPods[beforeIndex] != -1){
                            return true;
                        }
                    }
                    else if(mode == 'after'){
                        
                        let afterIndex = j + 3;
                        if(rowPods[afterIndex] != opponent && rowPods[afterIndex] != -1){
                            console.log("AFTER WIN PREVENTED: ", rowPods);
                            return true;
                        }
                    }
                    
                } // three pair match if end

            } // three consecutive pods loop end

        } // check every row loop end

        return false;
    }

    // Checks if an alternative horizontal win was prevented
    //      (1) (1) (2) (1)     ;       (1) (2) (1) (1)
    function checkAlternativeHorizontalWinPrevented(board, opponent){

        // Check every row up to the highest row of the board
        for(let i = 0; i < board.highestRow; i++){

            let rowPods = getRow(board, i);

            if(rowPods.length > 3){
                // Check every 4 consecutive pod pairs
                for(let j = 0; j < rowPods.length - 3; j++){
                    
                    // Check (1) (1) (2) (1)
                    // Check  ^   ^       ^
                    if( equals4(rowPods[j], rowPods[j + 1], rowPods[j + 3], opponent) ){
                        // Check (1) (1) (2) (1)
                        //Check           ^
                        if(rowPods[j + 2] != opponent && rowPods[j + 2] != -1){
                            return true;
                        }
                    } 
                
                    // Check (1) (2) (1) (1)
                    // Check  ^       ^   ^
                    if( equals4(rowPods[j], rowPods[j + 2], rowPods[j + 3], opponent) ){
                    
                        // Check (1) (2) (1) (1)
                        // Check      ^
                        if(rowPods[j + 1] != opponent && rowPods[j + 1] != -1){
                            return true;
                        }
                    }
                
            } // 4 consecutive pairs loop end 

        } // length > 3 if end

        } // check every row loop end
        
        return false;
    }

    // Checks if a diagonal win was prevented
    function checkDiagonalWinPrevented(board, opponent, diagonals){

        // Check every diagonal
        for(let diagonal of diagonals){

            let dRow = getPodsFromDiagonal(board, diagonal);

            // Check every three consecutive pods
            for(let i = 0; i < dRow.length - 2; i++){

                // If any three consecutive pairs match
                if( equals4(dRow[i], dRow[i + 1], dRow[i + 2], opponent) ){

                    let beforeIndex = i - 1;
                    let afterIndex = i + 3;

                    // Check before them
                    // CAN you check before them
                    if(beforeIndex >= 0 || dRow[afterIndex] <= dRow.length - 1){

                        if(dRow[beforeIndex] == -1 || dRow[afterIndex] == -1){
                            return false;
                        }

                        // If the pod before them or after them is a current player - type pod
                        if( dRow[beforeIndex] != opponent || 
                            dRow[afterIndex] != opponent){
                            return true;
                        }

                    }

                    // // Check after them
                    // // CAN you check after them
                    // if(afterIndex <= dRow.length - 1){

                    //     // If the pod after them is a current player - type pod
                    //     if(dRow[afterIndex] != opponent && dRow[afterIndex] != -1){
                    //         return true;
                    //     }
                    // }

                } // three pairs match if end

            } // three consecutive pods loop end

        } // check every diagonal loop end

    }


    // CHECKS IF OPPONENT IS ABOUT TO WIN
    function aboutToWin(mode, board, opponent){
        if(mode == 'v'){
            return checkAboutToWinVertical(board, opponent);
        }
        else if( mode == 'h'){
            return checkAboutToWinHorizontal(board, opponent);
        }
        else if( mode == 'altH'){
            return checkAboutToWinAlternativeHorizontal(board, opponent);
        }
        else if( mode == 'dm'){
            return checkAboutToWinDiagonal(board, opponent, mainDiagonals);
        }
        else if( mode == 'ds'){
            return checkAboutToWinDiagonal(board, opponent, secondaryDiagonals);
        }
        else{
            return false;
        }
    }



    // CHECKS IF OPPONENT IS IN A CHECK MATE POSITION
    function opponentCheckMate(board, opponent){

        for(let i = 0; i < rows; i++){

            let podRow = getRow(board, i);

            for(let j = 1; j < podRow.length - 2; j++){
                
                if( equals3(podRow[j], podRow[j+1], opponent) ){

                    if(podRow[j-1] == -1 && podRow[j + 2] == -1){
                        return true;
                    }

                }
            }

        }
        return false;
    }

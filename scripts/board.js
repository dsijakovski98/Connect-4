class Board{
    constructor(columns = [], highestRow){
        this.columns = columns;
        this.highestRow = highestRow;
        // console.log(this.columns[0].hasWinner());
    }

    setHighestRow(num){
        this.highestRow = num;
    }
}
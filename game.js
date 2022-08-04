let game = function() {
    const turns = ['0', 'X'];
    let turncounter = 0;
    let turn = turns[turncounter];
    let gameOver = false;
    let startButton = document.getElementById('start-button');
    let messageDiv = document.getElementById('message');
    let mode = "CPU";

    let init = () => {
        console.log("initialize");
        startButton.addEventListener('click', () => {
                gameOver = false;
                turncounter = 0;
                turn = turns[0];
                messageDiv.textContent = "Welcome to Tic-Tac-Toe";
                startButton.textContent = "Restart";
                gameBoard.init();
            }
        );
    };

    let getTurn = () => {
        return turn;
    };

    let endTurn = () => {
        if (!gameOver) {
            if (gameBoard.checkWin(turn)) {
                displayMessage(turn);     
                gameOver = true; 
            } else if (gameBoard.boardFilled()) {
                displayMessage()
                gameOver = true;
            } else {
                turncounter += 1;
                turn = turns[turncounter%turns.length];
            }
            if (turn == 'X') {
                //CPU turn
                let cell;
                let counts = gameBoard.getSymCounts('X');
                // Prioritize single cells that would give victory (TODO)
                
                // Go for center and corners
                if (gameBoard.isCellEmpty(1, 1)) {
                    cell = gameBoard.getCell(1, 1);
                } else if (gameBoard.isCellEmpty(0, 0)) {
                    cell = gameBoard.getCell(0, 0);
                } else if (gameBoard.isCellEmpty(2, 0)) {
                    cell = gameBoard.getCell(2, 0);
                } else if (gameBoard.isCellEmpty(0, 2)) {
                    cell = gameBoard.getCell(0, 2);
                } else if (gameBoard.isCellEmpty(2, 2)) {
                    cell = gameBoard.getCell(2, 2);
                } else {
                    // otherwise get a random empty cell
                    cell = gameBoard.getRandomEmptyCell();
                }
                gameBoard.setCell(cell, turn);
                endTurn();
            }
        }
    };

    let getGameOver = () => {
        return gameOver;
    };

    function displayMessage(winner = false) {

        if (winner) {
            messageDiv.textContent = `The winner is ${winner}!`;
        } else {
            messageDiv.textContent = "The game was tied.";
        }
    }


    return {init, getTurn, endTurn, getGameOver};
}();


let gameBoard = function() {
    let board;

    let init = () => {
        if (board != undefined) {
            for (let row=0; row < board.length; row++) {
                for (let col=0; col < board[row].length; col++) {
                    board[row][col].cell.remove();
                }
            }
        }       

        board = [];
        let boardContainer = document.getElementById('game-board');
        for (let row=0; row < 3; row++) {
            board.push([]);
            for (let col=0; col < 3; col++) {
                let s = '-';
                let cDiv = cellDiv(row, col, s);
                let c = {sym: s, cell: cDiv};
                               
                cDiv.addEventListener('click', () => {
                    if (game.getTurn() == '0' && !game.getGameOver()) {
                        setCell(c, game.getTurn());
                        game.endTurn();
                    }
                });

                boardContainer.appendChild(cDiv);
                board[row].push(c);
            }
        }
    };

    let setCell = (cellData, symbol) => {
        if (cellData.sym == '-') {
            cellData.sym = symbol;
            cellData.cell.textContent = symbol;
        }
    };

    let checkWin = (turn) => {
        return ((board[0][0].sym == turn && board[0][1].sym == turn && board[0][2].sym == turn)
         || (board[1][0].sym == turn && board[1][1].sym == turn && board[1][2].sym == turn)
         || (board[2][0].sym == turn && board[2][1].sym == turn && board[2][2].sym == turn)
         || (board[0][0].sym == turn && board[1][0].sym == turn && board[2][0].sym == turn)
         || (board[0][1].sym == turn && board[1][1].sym == turn && board[2][1].sym == turn)
         || (board[0][2].sym == turn && board[1][2].sym == turn && board[2][2].sym == turn)
         || (board[0][0].sym == turn && board[1][1].sym == turn && board[2][2].sym == turn)
         || (board[2][0].sym == turn && board[1][1].sym == turn && board[0][2].sym == turn))
    };

    let getSymCounts = (sym) => {
        let rowCounts = [];
        let colCounts = [];
        let diagCounts = [];
        for (let row = 0; row < board.length; row++) {
            let rowSymCount = 0;
            let colSymCount = 0;
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col].sym == sym) rowSymCount += 1;
                if (board[col][row].sym == sym) colSymCount += 1;

            }
            rowCounts.push(rowSymCount);
            colCounts.push(colSymCount);
        }

        let diagASymCount = 0;
        let diagBSymCount = 0;
        let i = 0;
        let j = 2;
        while (i < 3) {
            if (board[i][i].sym == sym) diagASymCount += 1; 
            if (board[i][j].sym == sym) diagBSymCount += 1;
            i++;
            j--;
        }
        diagCounts.push(diagASymCount);
        diagCounts.push(diagBSymCount);
        return {rowCounts, colCounts, diagCounts};
    }

    let boardFilled = () => {
        for (let i=0; i<board.length; i++) {
            for (let j=0; j<board[i].length; j++) {
                if (board[i][j].sym == '-') return false;
            }
        }
        return true;
    };

    let getRandomEmptyCell = () => {
        let counter = 0;
        while (counter < 1000) {
            counter += 1;
            let rRow = Math.floor(Math.random() * 3);
            let rCol = Math.floor(Math.random() * 3);
            if (board[rRow][rCol].sym == '-') {
                return board[rRow][rCol];
            }
        }
        console.log("Loop overflow.");
    };

    let getCell = (row, col) => {
        return board[row][col];
    };

    let isCellEmpty = (row, col) => {
        return (board[row][col].sym == '-');
    };

    function cellDiv (row, column, symbol) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = `row: ${row.toString()}, col: ${column.toString()}`;
        cell.textContent = symbol;
        return cell;
    }

    return {init, checkWin, boardFilled, getRandomEmptyCell, getCell, setCell, isCellEmpty, getSymCounts};
}();


game.init();
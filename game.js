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
                displayMessage();
                gameOver = true;
            } else {
                turncounter += 1;
                turn = turns[turncounter%turns.length];
            }
            if (turn == 'X') {
            //CPU turn
                // Prioritize single cells that would give victory
                let cell = gameBoard.getLoneEmptyCell();
                if (cell == null) {
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
        let boardContainer = document.getElementById('game-board');
        document.getElementById('message').textContent = "";
        if (boardContainer == null) {
            // If the board doesn't exist yet, create a board container for the new cell divs.
            let gameArea = document.getElementById('game-area');
            boardContainer = document.createElement('div');
            boardContainer.id = 'game-board';
            gameArea.appendChild(boardContainer);  
        } else {
            // If the board exists, remove all previous cell divs from the board.
            for (let row=0; row < board.length; row++) {
                for (let col=0; col < board[row].length; col++) {
                    board[row][col].cell.remove();
                }
            }
        }
        // Populate the board data array with empty cells.
        board = [];
        for (let row=0; row < 3; row++) {
            board.push([]);
            for (let col=0; col < 3; col++) {
                let s = '-';
                let cDiv = cellDiv(row, col, s);
                let c = {sym: s, cell: cDiv};
                // Add an event listener to each cell div for clicking               
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

    let getLoneEmptyCell = () => {
    // rows 
        for (let row = 0; row < 3; row++) {
            let emptyCell = null;
            let rowSymbol = null;
            for (let col=0; col < 3; col++) {
                let c = board[row][col];
                if (c.sym == '-') {
                    if (emptyCell == null) {
                        emptyCell = c;
                    } else {
                        emptyCell = null;
                        break;
                    }
                } else {
                    if (rowSymbol == null) {
                        rowSymbol = c.sym;
                    } else if (c.sym != rowSymbol) {
                        emptyCell = null;
                        break;
                    }
                }
            }
            if (emptyCell != null) return emptyCell;
        }
    // columns
        for (let col = 0; col < 3; col++) {
            let emptyCell = null;
            let rowSymbol = null;
            for (let row=0; row < 3; row++) {
                let c = board[row][col];
                if (c.sym == '-') {
                    if (emptyCell == null) {
                        emptyCell = c;
                    } else {
                        emptyCell = null;
                        break;
                    }
                } else {
                    if (rowSymbol == null) {
                        rowSymbol = c.sym;
                    } else if (c.sym != rowSymbol) {
                        emptyCell = null;
                        break;
                    }
                }
            }
            if (emptyCell != null) return emptyCell;
        }
    // diagonals
        let emptyCell = null;
        let rowSymbol = null;
        for (let i = 0; i < 3; i++) {

            let c = board[i][i];
            if (c.sym == '-') {
                if (emptyCell == null) {
                    emptyCell = c;
                } else {
                    emptyCell = null;
                    break;
                }
            } else {
                if (rowSymbol == null) {
                    rowSymbol = c.sym;
                } else if (c.sym != rowSymbol) {
                    emptyCell = null;
                    break;
                }
            }
        }
        if (emptyCell != null) return emptyCell;
        emptyCell = null;
        rowSymbol = null;
        for (let i = 0; i < 3; i++) {

            let c = board[i][2-i];
            if (c.sym == '-') {
                if (emptyCell == null) {
                    emptyCell = c;
                } else {
                    emptyCell = null;
                    break;
                }
            } else {
                if (rowSymbol == null) {
                    rowSymbol = c.sym;
                } else if (c.sym != rowSymbol) {
                    emptyCell = null;
                    break;
                }
            }
        }
        return emptyCell;
    };

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

    return {init, checkWin, boardFilled, getRandomEmptyCell, getCell, setCell, isCellEmpty, getLoneEmptyCell};
}();


game.init();
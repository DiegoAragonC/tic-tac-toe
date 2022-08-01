let game = function() {
    const turns = ['0', 'X'];
    let turncounter = 0;
    let turn = turns[turncounter];
    let gameOver = false;

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
        }
    };

    let getGameOver = () => {
        return gameOver;
    };

    function displayMessage(winner = false) {
        let messageDiv = document.getElementById('message');
        if (winner) {
            messageDiv.textContent = `The winner is ${winner}!`;
        } else {
            messageDiv.textContent = "The game was tied.";
        }
    }


    return {getTurn, endTurn, getGameOver};
}();


let gameBoard = function() {
    let board;

    let init = () => {
        board = [];
        let boardContainer = document.getElementById('game-board');
        for (let row=0; row < 3; row++) {
            board.push([]);
            for (let col=0; col < 3; col++) {
                let s = '-';
                let c = cellDiv(row, col, s);
                c.addEventListener('click', () => {
                    if (!game.getGameOver()) {
                        setCell(row, col, game.getTurn(), c);
                        game.endTurn();
                    }
                });
                board[row].push({sym: s, cell: c});
                boardContainer.appendChild(c);
            }
        }
    };

    function setCell(row, col, symbol, cell) {
        if (board[row][col].sym == '-') {
            board[row][col].sym = symbol;
            cell.textContent = symbol;
        }
    }

    function cellDiv (row, column, symbol) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = `row: ${row.toString()}, col: ${column.toString()}`;
        cell.textContent = symbol;
        return cell;
    }

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

    let boardFilled = () => {
        for (let i=0; i<board.length; i++) {
            for (let j=0; j<board[i].length; j++) {
                if (board[i][j].sym == '-') return false;
            }
        }
        return true;
    };

    return {init, checkWin, boardFilled};
}();

gameBoard.init();
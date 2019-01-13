////////////////////
////// SERVER /////
///////////////////

const express  = require('express');
const app      = express();
const human    = 'x';
const computer = 'o';

app.get('/', function (req, res, next) {
  if (!req.query.board) {  // 400 if no board param passed
    return next(new Error('Please pass a valid board as a query parameter'))
  };
  const boardArr = swapIndicesAndSpaces(req.query.board.split(''));
  const nextMove = playTicTacToe(boardArr, next);

  if (nextMove) {
    boardArr[nextMove.index] = 'o';
    res.send(swapIndicesAndSpaces(boardArr).join(''));
  }
});

app.use(function (err, req, res, next) {
  res.status(400).send({err: err.message});
});

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening 🤖');
});

///////////////////
//// APP LOGIC ////
///////////////////

function swapIndicesAndSpaces(arr) {
  const containsSpaces = arr.includes(' ');
  return arr.map((val, i) => {
    if (containsSpaces ? val === ' ' : Number.isInteger(val)) {
      return (containsSpaces ? i : ' '); // convert spaces to the space's index,
    } else {                             // or vice versa
      return val;
    }
  });
}

function playTicTacToe(board, next) {
  const emptySquares = filterBoard(board);

  // if the game is over throw an error
  if (playerHasWon(board, human) || playerHasWon(board, computer)) {
    return next(new Error('A player has already won'));
  }
  // if there are other chars throw an error
  if (board.filter(square => square !== 'x' && square !== 'o' && !Number.isInteger(square)).length > 0) {
    return next(new Error('Valid characters are: o, x and +'))
  }
  // if there are more or fewer than 9 characters it's not a valid board
  if (board.length !== 9) {
    return next(new Error('A valid board consists of nine characters'));
  }
  // if the board is full throw err
  if (emptySquares.length === 0) {
    return next(new Error('The board is full!'))
  };
  // if there are more os than xs throw err
  if (filterBoard(board, 'o').length > filterBoard(board, 'x').length) {
    return next(new Error('It is not plausibly o\'s turn'));
  };
  return miniMax(board);
}

function generateScore(squares, board) {
  if (playerHasWon(board, human)) {
    return { score: -1 };
  } else if (playerHasWon(board, computer)) {
    return { score: 1 };
  } else if (squares.length === 0) {
    return { score: 0 };
  }
}

function miniMax(board, player = computer) {  // default to computer player
  let bestMove;
  const moves          = [];
  const emptySquares   = filterBoard(board);
  const score          = generateScore(emptySquares, board);
  const opposingPlayer = player === computer ? human : computer;
  let bestScore        = player === computer ? -100 : 100;

  if (score) return score;                    // recurse until we can return a score

  emptySquares.forEach((square, i) => {
    let move               = {};
    move.index             = emptySquares[i]; // store the index of the square
    board[emptySquares[i]] = player;          // mark the square for the current player
    move.score             = miniMax(board, opposingPlayer).score; // alternate players
    board[emptySquares[i]] = move.index;      // reset the space to its empty state
    moves.push(move);
  });

  moves.forEach((move, i) => {
    if (player === computer ? moves[i].score > bestScore : moves[i].score < bestScore) {
      bestScore = moves[i].score;
      bestMove  = i;
    }
  });
  return moves[bestMove];
}

function filterBoard(board, val = 'int') {    // default val to integers
  if (val === 'int') return board.filter(square => Number.isInteger(square));
  return board.filter(square => square === val);
}

function playerHasWon(board, player) {
  let gameOver = false;
  const winningCombinations = [
    [0,1,2], [3,4,5], [6,7,8],  // horizontal
    [0,3,6], [1,4,7], [2,5,8],  // vertical
    [0,4,8], [2,4,6]            // diagonal
  ];
  winningCombinations.forEach((c) => {
    if (board[c[0]] == player && board[c[1]] == player && board[c[2]] == player) {
      gameOver = true
    };
  });
  return gameOver;
}

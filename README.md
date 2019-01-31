# Minimax Tic Tac Toe

## Try it out: [http://localhost:3000/?board=ox+x+++++](http://localhost:3000/?board=ox+x+++++)

This little app takes a `board` querystring. `board` should be a nine character string that represents a tic tac toe board, moving left to right beginning from the top row.

You, human, are `x`, the computer is `o` and spaces are represented with `+`.

The querystring `?board=ox+x+++++` would represent a board that looks like this:

```js
//   o  |  x  |
// ----------------
//   x  |     |
// ----------------
//      |     |
```

The express server does basic board validation and implements a minimax algorithm in deciding the computer's next move.

### What's next

The minimax implementation should rank available moves so that the computer wins in the fewest possible turns.

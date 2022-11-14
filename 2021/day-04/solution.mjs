import { readFileSync } from 'fs';

const input = readFileSync('input.txt').toString();

const boards = [];

let [draw, ...data] = input.split('\n');

draw = draw.split(',').map(item => parseInt(item, 10));

let board;
for (let item of data) {
  if (item == '') {
    if (board) {
      boards.push(board);
    }
    board = [];
    continue;
  }
  board.push(item.trim().split(/ +/).map(i => parseInt(i.trim(), 10)));
}

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}

// console.log(draw);
// console.log(boards);

class Board {
  constructor(b, s, d) {
    this.b = b;
    this.d = d;
    this.s = s || [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
    this.m = this.createMap(b);
  }

  createMap(b) {
    const m = new Map();
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        m.set(b[i][j], [i, j]);
      }
    }
    return m;
  }

  mark(num) {
    if (this.m.has(num)) {
      const [row, col] = this.m.get(num);
      this.s[row][col] = 1;
    }
  }

  isWinning() {
    const s = this.s;
    return (
      s.some(row => row.every(i => i==1))
        || (s.some((_, i) => s[0][i] && s[1][i] && s[2][i] && s[3][i] && s[4][i]))
    );
  }

  sumUnmarked() {
    const { b, s } = this;
    let sum = 0;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (s[i][j] == 0) {
          sum += b[i][j];
        }
      }
    }
    return sum;
  }
}

class Game {
  constructor(boards) {
    this.boards = boards.map(item => new Board(item));
  }

  mark(num) {
    this.boards.forEach(b => b.mark(num));
  }

  isWinning() {
    return this.boards.find(b => b.isWinning());
  }
}

{
  let result = null;
  const game = new Game(boards);
  let winning;

  for (let d of draw) {
    game.mark(d);

    winning = game.isWinning();
    if (winning) {
      result = d * winning.sumUnmarked();
      break;
    }
  }

  console.log('part 1:', result);
}

{
  let result = null;
  const game = new Game(boards);
  let winning;
  let lastdraw;

  for (let d of draw) {
    game.mark(d);

    winning = game.isWinning();
    if (winning) {
      game.boards = game.boards.filter(b => !b.isWinning());
      lastdraw = d;
      if (game.boards.length == 0) {
        break;
      }
    }
  }
  result = lastdraw * winning.sumUnmarked();

  console.log('part 2:', result);
}

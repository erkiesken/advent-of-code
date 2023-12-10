import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const toInt = (val: string) => parseInt(val, 10);
const tapConsole = R.tap(console.debug);

type Pipes = string[][];
type Pos = {
  row: number,
  col: number,
};

function parse(data: string): Pipes {
  return R.pipe(
    R.split("\n"),
    R.map(R.split("")),
  )(data);
}

function findStart(data: Pipes): Pos {
  const rl = data.length;
  const cl = data[0].length;
  for (let r = 0; r < rl; r++) {
    for (let c = 0; c < cl; c++) {
      if (data[r][c] == "S") {
        return { row: r, col: c } as Pos;
      }
    }
  }
  throw new Error("Could not find start 'S'");
}

function findPos(data: Pipes, pos: Pos) {
  return (data[pos.row] && data[pos.row][pos.col]) || ".";
}

function findStartMoves(data: Pipes, pos: Pos): Pos[] {
  const { row, col } = pos;
  const moves = [] as Pos[];
  let check: Pos;
  // Check if can go up
  check = { row: row - 1, col };
  if (["7","|","F"].includes(findPos(data, check))) {
    moves.push(check);
  }
  // Check if can go right
  check = { row: row, col: col + 1 };
  if (["7","-","J"].includes(findPos(data, check))) {
    moves.push(check);
  }
  // Check if can go down
  check = { row: row + 1, col };
  if (["J","|","L"].includes(findPos(data, check))) {
    moves.push(check);
  }
  // Check if can go left
  check = { row: row, col: col - 1 };
  if (["L","-","F"].includes(findPos(data, check))) {
    moves.push(check);
  }
  return moves;
}

function offsets(c: string, pos: Pos): Pos {
  const { row, col } = pos;
  switch (c) {
    case "|":
      return [{ row: row - 1, col }, { row: row + 1, col }];
    case "-":
      return [{ row, col: col - 1 }, { row, col: col + 1 }];
    case "L":
      return [{ row: row - 1, col }, { row, col: col + 1 }];
    case "J":
      return [{ row: row - 1, col }, { row, col: col - 1 }];
    case "7":
      return [{ row, col: col - 1 }, { row: row + 1, col }];
    case "F":
      return [{ row: row + 1, col }, { row, col: col + 1 }];
    case "S":
      return [];
    default:
      throw new Error(`No moves from '${c}' at '${row}:${col}'`);
  }
}

function findMoves(data: Pipes, pos: Pos): Pos[] {
  return offsets(findPos(data, pos), pos);
}

function samePos(a, b: Pos): boolean {
  return a.row == b.row && a.col == b.col;
}

function printBox(data: string) {
  return (data
    .replaceAll("|", "┃")
    .replaceAll("-", "━")
    .replaceAll("L", "┗")
    .replaceAll("J", "┛")
    .replaceAll("7", "┓")
    .replaceAll("F", "┏")
    .replaceAll(".", "╺")
  );
}

function fill(rows, cols: number, m: Map) {
  let id = "";
  const todo = [[-1, -1]];
  while (todo.length) {
    const [r, c] = todo.shift();
    id = `${r}:${c}`;
    if (m.has(id) || (r < -1) || (r > rows+1) || (c < -1) || (c > cols+1)) {
      continue;
    }
    m.set(id, "x");
    todo.push([r - 1, c]);
    todo.push([r + 1, c]);
    todo.push([r, c - 1]);
    todo.push([r, c + 1]);
  }
  return m;
}

function markUnvisited(rows, cols: number, m: Map, mark: string = "@") {
  let id = "";
  for (let r=-1; r < rows + 1; r++) {
    for (let c=-1; c < cols + 1; c++) {
      id = `${r}:${c}`;
      if (!m.has(id) && r % 2 == 0 && c % 2 == 0) {
        m.set(id, mark);
      }
    }
  }
  return m;
}

function printFill(rows, cols: number, m: Map) {
  let id = "";
  let res = "";
  for (let r=-1; r < rows + 1; r++) {
    for (let c=-1; c < cols + 1; c++) {
      id = `${r}:${c}`;
      res += m.has(id) ? m.get(id) : ".";
    }
    res += "\n";
  }
  console.log(res);
}

function posId(pos: Pos): string {
  return `${pos.row}:${pos.col}`;
}

{
  const data = parse(input);
  const start = findStart(data);

  let dist = 1;
  let last: Pos = start;
  let next: Pos;
  let pos: Pos = R.head(findStartMoves(data, start));
  while (true) {
    const moves = findMoves(data, pos);
    next = R.head(R.reject((val) => samePos(val, last), moves));
    last = pos;
    pos = next;
    dist++;
    if (findPos(data, pos) == "S") {
      break;
    }
  }

  console.log("part 1:", dist / 2);
}

{
  const data = parse(input);
  const start = findStart(data);
  const list = [];

  let last: Pos = start;
  let next: Pos;
  let pos: Pos = R.head(findStartMoves(data, start));
  while (true) {
    list.push([pos, findPos(data, pos)]);
    const moves = findMoves(data, pos);
    next = R.head(R.reject((val) => samePos(val, last), moves));
    last = pos;
    pos = next;
    if (findPos(data, pos) == "S") {
      list.push([pos, "S"]);
      break;
    }
  }

  const m = new Map();
  // Fill 2x positions of the graph
  R.pipe(
    // 2x coords
    R.map(([pos, c]) => [{ row: pos.row * 2, col: pos.col * 2 }, c]),
    // find new offsets to mark
    R.map(([pos, c]) => [pos, ...offsets(c, pos)]),
    R.flatten,
    // mark all points and in-betweens
    R.map((pos) => {
      m.set(posId(pos), "#");
    }),
  )(list);

  // Flood fill from top-left and mark every unvisited node withing the loop
  // printFill(data.length * 2, data[0].length * 2, m);
  fill(data.length * 2, data[0].length * 2, m);
  markUnvisited(data.length * 2, data[0].length * 2, m, "@");
  // printFill(data.length * 2, data[0].length * 2, m, true);

  const unvisited = R.pipe(
    R.filter(R.equals("@")),
    R.length,
  )(Array.from(m.values()))

  console.log("part 2:", unvisited);
}

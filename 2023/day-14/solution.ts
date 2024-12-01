import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const toInt = (val: string) => parseInt(val, 10);
const tapConsole = R.tap(console.debug);

enum Rock {
  Square = "#",
  Round = "O",
  Empty = ".",
}

type Rocks = Rock[][];

function parse(data: string): Rocks {
  return R.pipe(
    R.split("\n"),
    R.map(R.split("")),
  )(data) as Rocks;
}

function print(data: Rocks) {
  console.log(stringify(data));
}

function stringify(data: Rocks) {
  return R.pipe(
    R.map(R.join("")),
    R.join("\n"),
  )(data);
}

function moveRocks(tilt: string, data: Rocks): Rocks {
  const rows = data.length;
  const cols = data[0].length;
  let rock: Rock;

  if (tilt == "N") {
    for (let r=1; r < rows; r++) {
      col:
      for (let c=0; c < cols; c++) {
        rock = data[r][c];
        if (rock != Rock.Round) {
          continue;
        }
        for (let rr=r-1; rr >= 0; rr--) {
          if (data[rr][c] == Rock.Empty) {
            data[rr][c] = Rock.Round;
            data[rr+1][c] = Rock.Empty;
          } else {
            continue col;
          }
        }
      }
    }
  } else if (tilt == "S") {
    for (let r=rows-2; r >= 0; r--) {
      col:
      for (let c=0; c < cols; c++) {
        rock = data[r][c];
        if (rock != Rock.Round) {
          continue;
        }
        for (let rr=r+1; rr < rows; rr++) {
          if (data[rr][c] == Rock.Empty) {
            data[rr][c] = Rock.Round;
            data[rr-1][c] = Rock.Empty;
          } else {
            continue col;
          }
        }
      }
    }
  } else if (tilt == "W") {
    for (let c=1; c < cols; c++) {
      col:
      for (let r=0; r < rows; r++) {
        rock = data[r][c];
        if (rock != Rock.Round) {
          continue;
        }
        for (let cc=c-1; cc >= 0; cc--) {
          if (data[r][cc] == Rock.Empty) {
            data[r][cc] = Rock.Round;
            data[r][cc+1] = Rock.Empty;
          } else {
            continue col;
          }
        }
      }
    }
  } else if (tilt == "E") {
    for (let c=cols - 2; c >= 0; c--) {
      col:
      for (let r=0; r < rows; r++) {
        rock = data[r][c];
        if (rock != Rock.Round) {
          continue;
        }
        for (let cc=c+1; cc < cols; cc++) {
          if (data[r][cc] == Rock.Empty) {
            data[r][cc] = Rock.Round;
            data[r][cc-1] = Rock.Empty;
          } else {
            continue col;
          }
        }
      }
    }
  }

  return data;
}

function countLoad(data: Rocks): number {
  let load = 0;
  const rows = data.length;
  const cols = data[0].length;
  let rock: Rock;
  for (let r=0; r < rows; r++) {
    for (let c=0; c < cols; c++) {
      rock = data[r][c];
      if (rock == Rock.Round) {
        load += rows - r;
      }
    }
  }
  return load;
}

const tilt = R.curryN(2, moveRocks);

function cycle(data: Rocks): Rocks {
  return R.pipe(
    tilt("N"),
    tilt("W"),
    tilt("S"),
    tilt("E"),
  )(data);
}

{
  let data = parse(input);
  data = moveRocks("N", data);

  console.log("part 1:", countLoad(data));
}

{
  let data = parse(input);
  const c = 1_000_000_000;
  let seen = [stringify(data)];
  let s: string;
  let idx: number;
  for (let i = 0; i < c; i++) {
    data = cycle(data);
    s = stringify(data);
    idx = R.findIndex(R.equals(s), seen);
    if (idx > -1) {
      // console.log(`No change after loop ${i} at index ${idx}`);
      seen = R.slice(idx + 1, Infinity, seen);
      break;
    }
    seen.push(s);
  }
  const load = R.pipe(
    R.nth(c % seen.length),
    parse,
    countLoad,
  )(seen);

  console.log("part 2:", load);
}

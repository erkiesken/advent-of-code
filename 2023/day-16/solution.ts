import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const toInt = (val: string) => parseInt(val, 10);
const tapConsole = R.tap(console.debug);

enum Tile {
  Empty = ".",
  SplitH = "-",
  SplitV = "|",
  MirrorNWSE = "\\",
  MirrorNESW = "/",
}

enum Dir {
  N = "N",
  E = "E",
  S = "S",
  W = "W",
}

type Beam = {
  dir: Dir,
  row: number,
  col: number,
}

function beamId(b: Beam): string {
  return `${b.row}:${b.col}-${b.dir}`;
}

function parse(data: string): Tile[][] {
  return R.pipe(
    R.split("\n"),
    R.map(R.split("")),
  )(data) as Tile[][];
}

function moveBeam(b: Beam): Beam {
  if (b.dir == Dir.N) {
    b.row--;
  } else if (b.dir == Dir.S) {
    b.row++;
  } else if (b.dir == Dir.W) {
    b.col--;
  } else if (b.dir == Dir.E) {
    b.col++;
  }

  return b;
}

function lazers(start: Beam, data: Tile[][]): string[] {
  const rows = data.length;
  const cols = data[0].length;
  const visited = new Map();
  let beams = [start];

  while (beams.length) {
    const remove: Beam[] = [];
    const add: Beam[] = [];
    for (const b of beams) {
      const id = beamId(b);
      // already been here in same direction, or out of bounds, then remove beam
      if (visited.has(id) || b.row < 0 || b.row >= rows || b.col < 0 || b.col >= cols) {
        // console.log('seen or out of bounds', b);
        remove.push(b);
        continue;
      }
      // mark this tile as visited by this beam and direction
      visited.set(id, `${b.row}:${b.col}`);

      const t: Tile = data[b.row][b.col];
      if (t == Tile.Empty
        || (t == Tile.SplitH && (b.dir == Dir.E || b.dir == Dir.W))
        || (t == Tile.SplitV && (b.dir == Dir.N || b.dir == Dir.S))) {
        // Just move the beam on
        moveBeam(b);
      } else if (t == Tile.SplitH && (b.dir == Dir.N || b.dir == Dir.S)) {
        // Split into horizontal beams
        remove.push(b);
        add.push(moveBeam({ ...b, dir: Dir.W }));
        add.push(moveBeam({ ...b, dir: Dir.E }));
      } else if (t == Tile.SplitV && (b.dir == Dir.W || b.dir == Dir.E)) {
        // Split into vertical beams
        remove.push(b);
        add.push(moveBeam({ ...b, dir: Dir.N }));
        add.push(moveBeam({ ...b, dir: Dir.S }));
      } else if ((t == Tile.MirrorNWSE && b.dir == Dir.W) || (t == Tile.MirrorNESW && b.dir == Dir.E)) {
        // Reflect northward
        b.dir = Dir.N;
        moveBeam(b);
      } else if ((t == Tile.MirrorNWSE && b.dir == Dir.E) || (t == Tile.MirrorNESW && b.dir == Dir.W)) {
        // Reflect southward
        b.dir = Dir.S;
        moveBeam(b);
      } else if ((t == Tile.MirrorNWSE && b.dir == Dir.N) || (t == Tile.MirrorNESW && b.dir == Dir.S)) {
        // Reflect westward
        b.dir = Dir.W;
        moveBeam(b);
      } else if ((t == Tile.MirrorNWSE && b.dir == Dir.S) || (t == Tile.MirrorNESW && b.dir == Dir.N)) {
        // Reflect eastward
        b.dir = Dir.E;
        moveBeam(b);
      } else {
        console.log("Beam not handled", b, t);
      }
    }
    beams = R.pipe(R.without(remove), R.concat(add))(beams);
  }

  return new Set(visited.values());
}

function allbeams(data: Tile[][]): Beam[] {
  const rows = data.length;
  const cols = data[0].length;
  const beams = [];

  for (let row = 0; row < rows; row++) {
    beams.push({ dir: Dir.E, row, col: 0 });
    beams.push({ dir: Dir.W, row, col: cols-1 });
  }
  for (let col = 0; col < cols; col++) {
    beams.push({ dir: Dir.S, row: 0, col });
    beams.push({ dir: Dir.N, row: rows-1, col });
  }
  return beams;
}

function print(data, visited) {
  let res = [];
  const rows = data.length;
  const cols = data[0].length;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      res.push(visited.has(`${r}:${c}`) ? "#" : ".");
    }
    res.push("\n");
  }
  console.log(res.join(""));
}

{
  const data = parse(input);
  const visited = lazers({ dir: Dir.E, row: 0, col: 0 }, data);

  console.log("part 1:", visited.size);
}

{
  const data = parse(input);

  const energized = R.pipe(
    allbeams,
    R.map((val) => lazers(val, data).size),
  )(data);

  console.log("part 2:", Math.max(...energized));
}

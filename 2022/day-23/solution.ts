import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";
import { range } from "https://deno.land/x/denum@v1.2.0/mod.ts";

const input = Deno.readTextFileSync("input.txt").trim();

type Data = string[][];

const data: Data = R.pipe(
  R.split("\n"),
  R.map(R.split("")),
)(input);

type World = Map<string, boolean>;

type Pos = {
  x: number,
  y: number,
};

const toInt = (val: string) => parseInt(val, 10);

function toKey(x: number, y: number) {
  return `${x}:${y}`;
}

function fromKey(k: string): Pos {
  const a = k.split(":");
  return { x: toInt(a[0]), y: toInt(a[1]) };
}

function parse(d: Data): World {
  const m: World = new Map();
  for (let y = 0; y < d.length; y++) {
    for (let x = 0; x < d[y].length; x++) {
      const k = toKey(x, y);
      const v = d[y][x];
      if (v == "#") {
        m.set(k, true);
      }
    }
  }
  return m;
}

type MinMax = { minx: number, miny: number, maxx: number, maxy: number };

type WorldSize = {
  w: number,
  h: number,
  free: number,
  taken: number,
  v: MinMax,
};

function size(m: World): WorldSize {
  return R.pipe(
    Array.from,
    R.map(fromKey),
    R.reduce((acc: MinMax, value: Pos) => {
      return {
        minx: R.min(acc.minx, value.x),
        miny: R.min(acc.miny, value.y),
        maxx: R.max(acc.maxx, value.x),
        maxy: R.max(acc.maxy, value.y),
      }
    }, { minx: Infinity, miny: Infinity, maxx: -Infinity, maxy: -Infinity }),
    (v: MinMax) => {
      const w = v.maxx - v.minx + 1;
      const h = v.maxy - v.miny + 1;
      return { w, h, taken: m.size, free: (w * h) - m.size, v };
    },
  )(m.keys()) as WorldSize;
}

function print(m: World) {
  const s = size(m);
  console.log(s);
  for (const y of range(s.v.miny, s.v.maxy)) {
    const r: string[] = [];
    for (const x of range(s.v.minx, s.v.maxx)) {
      r.push(m.has(toKey(x, y)) ? "#" : ".");
    }
    console.log(r.join(""));
  }
  console.log("");
}

function around(p: Pos) {
  const { x, y } = p;
  return toKeys([
    [x-1, y-1], [x, y-1], [x+1, y-1],
    [x-1, y  ],           [x+1, y  ],
    [x-1, y+1], [x, y+1], [x+1, y+1],
  ]);
}

function indir(p: Pos, dir: string) {
  const { x, y } = p;
  switch (dir) {
    case "N":
      return toKeys([
        [x-1, y-1], [x, y-1], [x+1, y-1],
      ]);
    case "S":
      return toKeys([
        [x-1, y+1], [x, y+1], [x+1, y+1],
      ]);
    case "W":
      return toKeys([
        [x-1, y-1],
        [x-1, y],
        [x-1, y+1],
      ]);
    case "E":
      return toKeys([
        [x+1, y-1],
        [x+1, y],
        [x+1, y+1],
      ]);
    default:
      throw new Error("Unknown direction");
  }
}

function go(p: Pos, dir: string) {
  const { x, y } = p;
  switch (dir) {
    case "N":
      return toKey(x, y-1);
    case "S":
      return toKey(x, y+1);
    case "W":
      return toKey(x-1, y);
    case "E":
      return toKey(x+1, y);
    default:
      throw new Error("Unknown direction");
  }
}

function toKeys(n: number[][]): string[] {
  const r: string[] = [];
  for (const [x, y] of n) {
    r.push(toKey(x, y));
  }
  return r;
}

function evolve(m: World, dirs: string[]): { m: World, dirs: string[], changes: number } {
  const proposed = new Map<string, Set<string>>();
  const nm: World = new Map();

  for (const k of m.keys()) {
    const p = fromKey(k);
    // Check if free all around
    if (R.none((v: string) => m.has(v), around(p))) {
      // Staying in place
      nm.set(k, true);
      continue;
    }
    let prop = false;
    for (const d of dirs) {
      // Check free in direction, propose move
      if (R.none((v: string) => m.has(v), indir(p, d))) {
        const nk = go(p, d);
        const ns = proposed.get(nk) || new Set();
        proposed.set(nk, ns.add(k));
        prop = true;
        break;
      }
    }
    if (!prop) {
      // Staying in place
      nm.set(k, true);
    }
  }

  let changes = 0;
  for (const [k, s] of proposed.entries()) {
    if (s.size == 1) {
      nm.set(k, true);
      changes++;
    } else if (s.size > 1) {
      // Return overlapping proposals to previous positions
      for (const kk of s.values()) {
        nm.set(kk, true);
      }
    }
  }

  return {
    m: nm,
    dirs: R.concat(R.tail(dirs), [R.head(dirs)]),
    changes,
  };
}

{
  let m = parse(data);
  let dirs = ["N", "S", "W", "E"];

  let round = 0;
  while (++round <= 10) {
    const e = evolve(m, dirs);
    m = e.m;
    dirs = e.dirs;
    // console.log("round changes", round, e.changes);
  }

  console.log("part 1:", size(m).free);
}

{
  let m = parse(data);
  let dirs = ["N", "S", "W", "E"];

  let round = 0;
  while (++round) {
    const e = evolve(m, dirs);
    m = e.m;
    dirs = e.dirs;
    // console.log("round changes", round, e.changes);
    if (e.changes == 0) {
      break;
    }
  }

  console.log("part 2:", round);
}

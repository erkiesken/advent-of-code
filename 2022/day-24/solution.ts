import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.txt").trim();

const toInt = (val: string) => parseInt(val, 10);

type Data = string[][];

const data: Data = R.pipe(
  R.split("\n"),
  R.pipe(
    R.init,
    R.tail,
    R.map(R.pipe(
      R.split(""),
      R.init,
      R.tail,
    )),
  ),
)(input);

type GameMap = Map<string, Set<string>>;
type Game = {
  w: number,
  h: number,
  c: number,
  m: GameMap,
}

type Pos = {
  x: number,
  y: number,
}

function toKey(x: number, y: number) {
  return `${x}:${y}`;
}

function fromKey(k: string): Pos {
  const a = k.split(":");
  return { x: toInt(a[0]), y: toInt(a[1]) };
}

function parse(d: Data): Game {
  const w = R.length(R.head(d));
  const h = R.length(d);
  const m: GameMap = new Map();

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = toKey(x, y);
      const v = data[y][x];
      m.set(k, new Set(v == "." ? undefined : v));
    }
  }

  return { w, h, m, c: 0 };
}

function up(x: number, y: number, g: Game): Pos {
  y = y - 1;
  if (y < 0) {
    y = g.h - 1;
  }
  return { x, y };
}
function down(x: number, y: number, g: Game): Pos {
  y = y + 1;
  if (y >= g.h) {
    y = 0;
  }
  return { x, y };
}
function left(x: number, y: number, g: Game): Pos {
  x = x - 1;
  if (x < 0) {
    x = g.w - 1;
  }
  return { x, y };
}
function right(x: number, y: number, g: Game): Pos {
  x  = x + 1;
  if (x >= g.w) {
    x = 0;
  }
  return { x, y };
}

type Move = (x: number, y: number, g: Game) => Pos;

const moves: { [key: string]: Move } = {
  "^": up,
  "<": left,
  ">": right,
  "v": down,
};

function evolve(g: Game): Game {
  const { w, h, m, c } = g;
  const n: GameMap = new Map();

  for (const [k, s] of m.entries()) {
    const { x, y } = fromKey(k);
    for (const v of s.values()) {
      const f = moves[v];
      const p = f(x, y, g);
      const kk = toKey(p.x, p.y);
      const ss = n.get(kk) || new Set();
      n.set(kk, ss.add(v));
    }
  }

  return { w, h, m: n, c: c + 1 };
}

function print(g: Game, pos: Pos) {
  const { w, h, m } = g;
  console.log("#." + "#".repeat(w));
  for (let y = 0; y < h; y++) {
    const r: string[] = ["#"];
    for (let x = 0; x < w; x++) {
      const k = toKey(x, y);
      const s = m.get(k) || new Set();
      if (s.size == 0) {
        if (pos.x == x && pos.y == y) {
          r.push("E");
        } else {
          r.push(".");
        }
      } else if (s.size > 1) {
        r.push(String(s.size));
      } else {
        r.push(Array.from(s.values())[0]);
      }
    }
    r.push("#");
    console.log(r.join(""));
  }
  console.log("#".repeat(w) + ".#" + "\n");
}

function isFree(x: number, y: number, g: Game) {
  const k = toKey(x, y);
  return (
    x >= 0
    && x < g.w
    && y >= 0
    && y < g.h
    && (!g.m.has(k) || g.m.get(k)!.size == 0)
  );
}

function solve(start: string, stop: string, g: Game): Game {
  const pos = new Set();
  const sc = g.c;
  pos.add(start);

  let i = 2000;
  outer:
  while (i-- && pos.size) {
    g = evolve(g);

    const ps: Pos[] = R.pipe(
      Array.from,
      R.map(fromKey),
    )(pos.values());
    pos.clear();

    for (const p of ps) {
      const pr = right(p.x, p.y, g);
      const pd = down(p.x, p.y, g);
      const pu = up(p.x, p.y, g);
      const pl = left(p.x, p.y, g);

      if (p.y < (g.h - 1) && isFree(pd.x, pd.y, g)) {
        pos.add(toKey(pd.x, pd.y));
      }
      if (p.x < (g.w - 1) && isFree(pr.x, pr.y, g)) {
        pos.add(toKey(pr.x, pr.y));
      }
      if (p.y > 0 && isFree(pu.x, pu.y, g)) {
        pos.add(toKey(pu.x, pu.y));
      }
      if (p.x > 0 && isFree(pl.x, pl.y, g)) {
        pos.add(toKey(pl.x, pl.y));
      }
      if (isFree(p.x, p.y, g) || toKey(p.x, p.y) == start) {
        pos.add(toKey(p.x, p.y));
      }

      // next to exit
      if (pos.has(stop)) {
        g = evolve(g);
        // console.log('found exit', g.c, g.c - sc);
        // print(g, fromKey(stop));
        break outer;
      }
    }
    // console.log("after step", g.c, "positions", pos.size);
  }

  return g;
}

{
  let g = parse(data);
  const start = "0:-1";
  const exit = `${g.w-1}:${g.h-1}`;

  g = solve(start, exit, g);

  console.log("part 1:", g.c);
}

{
  let g = parse(data);
  const startPos = "0:-1";
  const startFrom = "0:0";
  const exitPos = `${g.w-1}:${g.h}`;
  const exitFrom = `${g.w-1}:${g.h-1}`;
  const rounds = [
    [startPos, exitFrom],
    [exitPos, startFrom],
    [startPos, exitFrom],
  ];

  for (const [start, stop] of rounds) {
    g = solve(start, stop, g);
    // console.log("solved", start, stop, g.c);
  }

  console.log("part 2:", g.c);
}

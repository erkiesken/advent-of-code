import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";
import { combinations } from "https://deno.land/x/combinatorics/mod.ts";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const toInt = (val: string) => parseInt(val, 10);
const tapConsole = R.tap(console.debug);

type Pos = {
  x: number,
  y: number,
};

function parse(data: string): { w: number, h: number, stars: Pos[] } {
  const bits = R.pipe(
    R.split("\n"),
    R.map(R.split("")),
  )(data);

  const h = bits.length;
  const w = bits[0].length;
  const stars = [];
  let id = 0;
  for (let y=0; y < h; y++) {
    for (let x=0; x < w; x++) {
      if (bits[y][x] == "#") {
        stars.push({ x, y });
      }
    }
  }
  return { w, h, stars };
}

function print(w, h, stars) {
  const m = new Map();
  for (const s of stars) {
    m.set(`${s.x}:${s.y}`, s);
  }
  const r = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      r.push(m.has(`${x}:${y}`) ? "#" : ".");
    }
    r.push("\n");
  }
  console.log(r.join(""));
}

function solve(w: number, h: number, stars: Pos[], expansion: number): number[] {
  // extract unfilled x coord columns
  const xs = R.pipe(
    R.map(R.prop("x")),
    R.uniq,
    R.difference(R.range(0, w)),
    R.sort(R.gt),
    R.reverse,
  )(stars);
  // extract unfilled y coord rows
  const ys = R.pipe(
    R.map(R.prop("y")),
    R.uniq,
    R.difference(R.range(0, h)),
    R.sort(R.gt),
    R.reverse,
  )(stars);
  // expand x-wise
  for (const x of xs) {
    for (const s of stars) {
      if (s.x > x) {
        s.x += expansion - 1;
      }
    }
  }
  // expand y-wise
  for (const y of ys) {
    for (const s of stars) {
      if (s.y > y) {
        s.y += expansion - 1;
      }
    }
  }

  const pairs = Array.from(combinations(stars, 2));
  const distances = R.pipe(
    R.map(([a, b]) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)),
  )(pairs);
  return distances;
}

{
  const { w, h, stars } = parse(input);

  console.log("part 1:", R.sum(solve(w, h, stars, 2)));
}

{
  const { w, h, stars } = parse(input);

  console.log("part 2:", R.sum(solve(w, h, stars, 1_000_000)));
}

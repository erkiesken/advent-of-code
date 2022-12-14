import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";
import { range } from "https://deno.land/x/denum@v1.2.0/mod.ts";

const input = Deno.readTextFileSync("input.txt").trim();

const toInt = (val: string) => parseInt(val, 10);

type Coord = [number, number];
type Line = Coord[];
type M = Map<string, string>;

const data:Line[] = R.pipe(
  R.split("\n"),
  R.map(R.pipe(R.split(" -> "), R.map(R.pipe(R.split(","), R.map(toInt))))),
)(input);

function fillLines(d: Line[]): M {
  const m = new Map<string, string>();

  for (const l of d) {
    for (const i of range(0, l.length - 2)) {
      const from = l[i];
      const to = l[i+1];

      for (const x of range(from[0], to[0])) {
        for (const y of range(from[1], to[1])) {
          const p = `${x}:${y}`;
          m.set(p, "#");
        }
      }
    }
  }

  return m;
}

function print(m: M, minx: number, maxx: number, miny: number, maxy: number) {
  const out = [];
  for (const y of range(miny, maxy)) {
    const row = [];
    for (const x of range(minx, maxx)) {
      const p = `${x}:${y}`;
      row.push(m.get(p) || " ");
    }
    out.push(row.join(""));
  }
  console.log(out.join("\n"));
}

function evolve1(m: M, x: number, y:number, maxy: number) {
  while (y < maxy) {
    const pd = `${x}:${y+1}`;
    const pdl = `${x-1}:${y+1}`;
    const pdr = `${x+1}:${y+1}`;
    const vd = m.get(pd);
    const vdl = m.get(pdl);
    const vdr = m.get(pdr);

    if (vd === undefined) {
      // can move down
    } else if (vdl === undefined) {
      // can move down and left
      x--;
    } else if (vdr === undefined) {
      // can move down and right
      x++;
    } else {
      m.set(`${x}:${y}`, "o");
      return true;
    }
    y++;
  }

  // off to void
  m.set(`${x}:${y}`, "~");
  return false;
}

function evolve2(m: M, x: number, y:number, maxy: number) {
  while (y <= maxy) {
    const pd = `${x}:${y+1}`;
    const pdl = `${x-1}:${y+1}`;
    const pdr = `${x+1}:${y+1}`;
    const vd = m.get(pd);
    const vdl = m.get(pdl);
    const vdr = m.get(pdr);
    const atmax = y === maxy;

    if (!atmax && vd === undefined) {
      // can move down
    } else if (!atmax && vdl === undefined) {
      // can move down and left
      x--;
    } else if (!atmax && vdr === undefined) {
      // can move down and right
      x++;
    } else if (y === 0) {
      // reached the source
      m.set(`${x}:${y}`, "o");
      return false;
    } else {
      m.set(`${x}:${y}`, "o");
      return true;
    }
    y++;
  }

  return false;
}

const maxy = R.pipe(
  R.map(R.map(R.last)),
  R.flatten,
  (a: number[]) => Math.max(...a),
)(data);

{
  const m = fillLines(data);
  m.set("500:0", "+");

  let i = 0;
  while (evolve1(m, 500, 0, maxy)) {
    i++;
  }

  // print(m, minx - 1, maxx + 1, 0, maxy + 1);

  console.log("part 1:", i);
}

{
  const m = fillLines(data);
  m.set("500:0", "+");

  let i = 1;
  while (evolve2(m, 500, 0, maxy + 1)) {
    i++;
  }

  // print(m, minx - 20, maxx + 20, 0, maxy + 2);

  console.log("part 2:", i);
}

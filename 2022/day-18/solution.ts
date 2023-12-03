import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.txt").trim();

const toInt = (val: string) => parseInt(val, 10);

type Coord = [number, number, number];
type CoordMap = Map<string, Coord | boolean>;
type Bounds = {
  minx: number,
  maxx: number,
  miny: number,
  maxy: number,
  minz: number,
  maxz: number,
}

const data: Coord[] = R.pipe(
  R.split("\n"),
  R.map(R.pipe(R.split(","), R.map(toInt))),
)(input);

function key(c: Coord) {
  return `${c[0]}:${c[1]}:${c[2]}`;
}

const checks: Coord[] = [
  [1,0,0],
  [-1,0,0],
  [0,1,0],
  [0,-1,0],
  [0,0,1],
  [0,0,-1],
];

function countFree(c: Coord, d: CoordMap) {
  const [x, y, z] = c;
  let count = 0;

  for (const [dx, dy, dz] of checks) {
    if (!d.has(key([x + dx, y + dy, z + dz]))) {
      count++;
    }
  }

  return count;
}

function countFreeExternal(c: Coord, d: CoordMap) {
  const [x, y, z] = c;
  let count = 0;

  for (const [dx, dy, dz] of checks) {
    if (d.get(key([x + dx, y + dy, z + dz])) === true) {
      count++;
    }
  }
  return count;
}

function fillExternal(b: Bounds, d: CoordMap) {
  const neighbours = (c: Coord) => {
    const r: Coord[] = [];
    for (const [dx, dy, dz] of checks) {
      const x = c[0] + dx;
      const y = c[1] + dy;
      const z = c[2] + dz;
      if (x >= b.minx && x <= b.maxx
        && y >= b.miny && y <= b.maxy
        && z >= b.minz && z <= b.maxz) {
        r.push([x, y, z]);
      }
    }
    return r;
  };

  let q: Coord[] = [[b.minx, b.miny, b.minz]];

  while (q.length) {
    const c = q.shift()!;
    const k = key(c);
    if (!d.has(k)) {
      d.set(k, true);
      q = q.concat(neighbours(c))
    }
  }
}

{
  const d: CoordMap = new Map();
  for (const c of data) {
    d.set(key(c), c);
  }

  console.log("part 1:", R.pipe(
    Array.from,
    R.map((c: Coord) => countFree(c, d)),
    R.sum,
  )(d.values()));
}

{
  const d: CoordMap = new Map();
  for (const c of data) {
    d.set(key(c), c);
  }

  const xs = R.pipe(Array.from, R.map(R.prop(0)))(d.values());
  const ys = R.pipe(Array.from, R.map(R.prop(1)))(d.values());
  const zs = R.pipe(Array.from, R.map(R.prop(2)))(d.values());
  const minx = Math.min(...xs) - 1;
  const maxx = Math.max(...xs) + 1;
  const miny = Math.min(...ys) - 1;
  const maxy = Math.max(...ys) + 1;
  const minz = Math.min(...zs) - 1;
  const maxz = Math.max(...zs) + 1;
  const b: Bounds = { minx, maxx, miny, maxy, minz, maxz };

  fillExternal(b, d);

  console.log("part 2:", R.pipe(
    Array.from,
    R.reject(R.equals(true)),
    R.map((c: Coord) => countFreeExternal(c, d)),
    R.sum,
  )(d.values()));
}

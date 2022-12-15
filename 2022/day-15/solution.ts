import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";
import { range } from "https://deno.land/x/denum@v1.2.0/mod.ts";

const input = Deno.readTextFileSync("input.txt").trim();

const toInt = (val: string) => parseInt(val, 10);

const lineRE = /Sensor at x=(?<sx>-?\d+), y=(?<sy>-?\d+): closest beacon is at x=(?<bx>-?\d+), y=(?<by>-?\d+)/;

type Reading = {
  [key: string]: number
}

type Interval = [number, number];

const data = R.pipe(
  R.split("\n"),
  R.map(R.pipe(
    (v:string) => v.match(lineRE)!.groups,
    R.evolve({ sx: toInt, sy: toInt, bx: toInt, by: toInt }),
  )),
  R.map((v: Reading) => ({ ...v, r: Math.abs(v.sx - v.bx) + Math.abs(v.sy - v.by) })),
  R.map((v: Reading) => ({ ...v, minx: v.sx - v.r, maxx: v.sx + v.r, miny: v.sy - v.r, maxy: v.sy + v.r })),
)(input);

{
  const ry = 2000000;

  const nearby: Reading[] = R.filter(
    (v: Reading) => (v.miny <= ry && v.maxy >= ry)
  )(data);

  const taken = new Set<number>();

  for (const sensor of nearby) {
    const dx = sensor.r - Math.abs(sensor.sy - ry);
    for (const x of range(sensor.sx - dx, sensor.sx + dx)) {
      taken.add(x);
    }
  }
  for (const sensor of nearby) {
    if (sensor.by == ry) {
      taken.delete(sensor.bx);
    }
  }

  console.log("part 1:", taken.size);
}

function mergeIntervals(input: Interval[]): Interval[] {
  const arr = R.sort((a: Interval, b: Interval) => a[0] - b[0], input);
  let idx = 0;
  const out = [arr[0]];
  for (const i of range(1, arr.length - 1)) {
    if (out[idx][1] >= arr[i][0]) {
      out[idx][1] = Math.max(out[idx][1], arr[i][1]);
    } else {
      idx += 1;
      out[idx] = arr[i];
    }
  }
  return out;
}

{
  let pos = [0, 0];

  outer:
  for (const ry of range(0, 4000000)) {
    const nearby: Reading[] = R.filter(
      (v: Reading) => (v.miny <= ry && v.maxy >= ry)
    )(data);
    let taken: Interval[] = [];

    for (const sensor of nearby) {
      const dx = sensor.r - Math.abs(sensor.sy - ry);
      taken.push([sensor.sx - dx, sensor.sx + dx]);
    }
    taken = mergeIntervals(taken);
    if (taken.length == 1) {
      continue;
    }

    for (let i = 1; i < taken.length; i++) {
      if (taken[i][0] - taken[i-1][1] > 1) {
        pos = [taken[i-1][1] + 1, ry];
        break outer;
      }
    }
  }

  console.log("part 2:", pos[0] * 4000000 + pos[1]);
}

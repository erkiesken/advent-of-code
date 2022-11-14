import { readFileSync } from 'fs';
import { pipe, map, __, toPairs, fromPairs, clone } from 'ramda';

const input = readFileSync('input.txt', { encoding: 'utf-8' }).trim();

const re = /^target area: x=(?<xmin>-?\d+)\.\.(?<xmax>-?\d+), y=(?<ymin>-?\d+)\.\.(?<ymax>-?\d+)$/;

const data = pipe(
  toPairs,
  map(([key, val]) => ([key, parseInt(val, 10)])),
  fromPairs,
)(input.match(re).groups);

const target = data;

function hitstarget(dx, dy) {
  let x = dx;
  let y = dy;
  let maxy = -Infinity;
  while (true) {
    if (y > maxy) {
      maxy = y;
    }
    if (x >= target.xmin
      && x <= target.xmax
      && y >= target.ymin
      && y <= target.ymax) {
      return [true, maxy];
    }
    if (x > target.xmax) {
      break;
    }
    if (y < target.ymin) {
      break;
    }
    if (dx != 0) {
      dx += (dx > 0) ? -1 : 1;
    }
    dy -= 1;
    x += dx;
    y += dy;
  }
  return [false, maxy];
}
{
  let result = null;
  let maxy = -Infinity;

  for (let x = target.xmax; x > 0; x--) {
    for (let y = target.ymin; y < 10000; y++) {
      const hit = hitstarget(x, y);
      if (hit[0] && hit[1] > maxy) {
        maxy = hit[1];
      }
    }
  }

  result = maxy;

  console.log('part 1:', result);
}

{
  let result = null;
  let hits = [];

  for (let x = target.xmax; x > 0; x--) {
    for (let y = target.ymin; y < 10000; y++) {
      const hit = hitstarget(x, y);
      if (hit[0]) {
        hits.push([x, y]);
      }
    }
  }

  result = hits.length;

  console.log('part 2:', result);
}

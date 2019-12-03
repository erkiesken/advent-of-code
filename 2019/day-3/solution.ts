import { assertEquals } from 'https://deno.land/std@v0.25.0/testing/asserts.ts';
import { readFileStrSync } from 'https://deno.land/std@v0.25.0/fs/read_file_str.ts';

const data = readFileStrSync('input.txt').split('\n');
const wires = data.map((line) => line.split(',').map((coords) => [coords.charAt(0), parseInt(coords.substr(1), 10)]));

const board = new Map();
const candidates = new Set();
const steps = new Map();

let w = 0;
outer:
for (let wire of wires) {
  let x = 0;
  let y = 0;
  let s = 0;
  for (let p of wire) {
    const [d, l] = p;
    for (let i = 0; i < l; i++) {
      if (d === 'R') {
        x += 1;
      } else if (d === 'L') {
        x -= 1;
      }
      if (d === 'U') {
        y -= 1;
      }
      if (d === 'D') {
        y += 1;
      }
      s += 1;
      const xy = `${x}:${y}`;
      if (board.has(xy) && board.get(xy)[0] !== w) {
        console.log(`already has ${xy} w=${w} ${board.get(xy)}`);
        candidates.add(xy);
        steps.set(xy, board.get(xy)[1] + s);
      } else {
        board.set(xy, [w, s]);
      }
    }
  }
  w += 1;
}

console.log(candidates);

{
  let result = Infinity;
  for (let p of candidates) {
    let [x, y] = p.toString().split(':');
    const dist = Math.abs(parseInt(x, 10)) + Math.abs(parseInt(y, 10));

    if (dist < result) {
      result = dist;
    }
  }

  console.log(`Closest crossing: ${result}`);
}

{
  let result = Infinity;
  for (let p of steps.entries()) {
    let [_, dist] = p;

    if (dist < result) {
      result = dist;
    }
  }

  console.log(`Shortes crossing: ${result}`);
}

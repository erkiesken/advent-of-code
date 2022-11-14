import { readFileSync } from 'fs';

const input = readFileSync('input.txt').toString().trim();

const data = input
      .split('\n')
      .map((l) => l.split(/ -> /).map((p) => p.split(',').map(v => parseInt(v, 10))));

function range(a, b) {
  const size = Math.abs(b - a) + 1;
  if (a < b) {
    return [...Array(size).keys()].map(i => i + a);
  }
  return [...Array(size).keys()].map(i => i + b).reverse();
}

function inc(m, x, y) {
  const k = `${x}:${y}`;
  if (m.has(k)) {
    m.set(k, m.get(k) + 1);
  } else {
    m.set(k, 1);
  }
}

{
  let result = null;

  const m = new Map();
  for (let line of data) {
    const [x1, y1] = line[0];
    const [x2, y2] = line[1];
    if (x1 == x2) {
      for (let y of range(y1, y2)) {
        inc(m, x1, y);
      }
    } else if (y1 == y2) {
      for (let x of range(x1, x2)) {
        inc(m, x, y1);
      }
    }
  }

  result = Array.from(m.values()).filter(v => v > 1).length;

  console.log('part 1:', result);
}

{
  let result = null;

  const m = new Map();
  for (let line of data) {
    const [x1, y1] = line[0];
    const [x2, y2] = line[1];
    if (x1 == x2) {
      for (let y of range(y1, y2)) {
        inc(m, x1, y);
      }
    } else if (y1 == y2) {
      for (let x of range(x1, x2)) {
        inc(m, x, y1);
      }
    } else {
      const xs = range(x1, x2);
      const ys = range(y1, y2);
      for (let i = 0; i < xs.length; i++) {
        inc(m, xs[i], ys[i]);
      }
    }
  }

  result = Array.from(m.values()).filter(v => v > 1).length;

  console.log('part 2:', result);
}

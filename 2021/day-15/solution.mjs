import { default as djikstra } from 'dijkstrajs';
import { readFileSync } from 'fs';
import { pipe, split, map, curry, __, clone, tail, sum } from 'ramda';

const toInt = curry(parseInt)(__, 10);

const input = readFileSync('input.txt', { encoding: 'utf-8' }).trim();

const data = pipe(
  split('\n'),
  map(split('')),
  map(map(toInt)),
)(input);

const neighbours = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
];

{
  const d = clone(data);
  const size = d.length;
  const start = '0:0';
  const end = `${size-1}:${size-1}`;
  const g = {};

  for (let i=0; i < size; i++) {
    for (let j=0; j < size; j++) {
      const k = `${i}:${j}`;
      const v = {};
      for (const [dx, dy] of neighbours) {
        const x = i + dx;
        const y = j + dy;
        if (d[x] && d[x][y]) {
          v[`${x}:${y}`] = d[x][y];
        }
      }
      g[k] = v;
    }
  }

  const path = djikstra.find_path(g, start, end);

  const result = pipe(
    tail,
    map(pipe(split(':'), map(toInt))),
    map(([x, y]) => d[x][y]),
    sum,
  )(path);

  console.log('part 1:', result);
}

{
  const times = 5;
  const origsize = data.length;
  const size = origsize * times;
  const d = Array(size).fill(0).map(() => Array(size).fill(0));
  const start = '0:0';
  const end = `${size-1}:${size-1}`;
  const g = {};

  for (let i=0; i < times; i++) {
    const dx = i * origsize;
    for (let j=0; j < times; j++) {
      const dy = j * origsize;
      const m = i + j;
      for (let x=0; x < origsize; x++) {
        for (let y=0; y < origsize; y++) {
          d[dx+x][dy+y] = (m + data[x][y] - 1) % 9 + 1;
        }
      }
    }
  }

  for (let i=0; i < size; i++) {
    for (let j=0; j < size; j++) {
      const k = `${i}:${j}`;
      const v = {};
      for (const [dx, dy] of neighbours) {
        const x = i + dx;
        const y = j + dy;
        if (d[x] && d[x][y]) {
          v[`${x}:${y}`] = d[x][y];
        }
      }
      g[k] = v;
    }
  }

  const path = djikstra.find_path(g, start, end);

  const result = pipe(
    tail,
    map(pipe(split(':'), map(toInt))),
    map(([x, y]) => d[x][y]),
    sum,
  )(path);

  console.log('part 2:', result);
}

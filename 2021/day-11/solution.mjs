import { readFileSync } from 'fs';
import { pipe, clone, repeat, prepend, append, split, map, curry, __ } from 'ramda';

const input = readFileSync('input.txt', { encoding: 'utf-8' }).trim();

const toInt = curry(parseInt)(__, 10);

const data = pipe(
  split('\n'),
  map(split('')),
  map(map(toInt)),
)(input);

// console.log(data);

function wrapinf(data, size) {
  return pipe(
    clone,
    map(pipe(prepend(-Infinity), append(-Infinity))),
    prepend(repeat(-Infinity, size + 2)),
    append(repeat(-Infinity, size + 2)),
  )(data);
}

function update(f, d, x, y) {
  const k = `${x}:${y}`;
  // has flashed already
  if (f.has(k)) {
    return;
  }
  if (d[x][y] > 9) {
    f.add(k);
    d[x - 1][y - 1] += 1;
    d[x - 1][y] += 1;
    d[x - 1][y + 1] += 1;
    d[x][y - 1] += 1;
    d[x][y + 1] += 1;
    d[x + 1][y - 1] += 1;
    d[x + 1][y] += 1;
    d[x + 1][y + 1] += 1;
  }
}

function addall(d, size) {
  for (let i = 1; i <= size; i++) {
    for (let j = 1; j <= size; j++) {
      d[i][j] += 1;
    }
  }
}

function resetall(d, size) {
  for (let i = 1; i <= size; i++) {
    for (let j = 1; j <= size; j++) {
      if (d[i][j] > 9) {
        d[i][j] = 0;
      }
    }
  }
}

{
  let result = null;
  const size = data.length;
  let runs = 100;
  let total = 0;

  const d = wrapinf(data, size);

  while (runs--) {
    let f = new Set();
    let prev = f.size;

    addall(d, size);
    while (true) {
      for (let i = 1; i <= size; i++) {
        for (let j = 1; j <= size; j++) {
          update(f, d, i, j);
        }
      }
      // no change from last update, settled
      if (prev === f.size) {
        break;
      }
      prev = f.size;
    }
    resetall(d, size);

    total += f.size;
  }

  result = total;

  console.log('part 1:', result);
}

{
  let result = null;
  const size = data.length;
  let run = 0;

  const d = wrapinf(data, size);

  while (++run) {
    let f = new Set();
    let prev = f.size;

    addall(d, size);
    while (true) {
      for (let i = 1; i <= size; i++) {
        for (let j = 1; j <= size; j++) {
          update(f, d, i, j);
        }
      }
      // no change from last update, settled
      if (prev === f.size) {
        break;
      }
      prev = f.size;
    }
    resetall(d, size);

    if (f.size == size * size) {
      result = run;
      break;
    }
  }

  console.log('part 2:', result);
}

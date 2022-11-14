import { readFileSync } from 'fs';
import { pipe, __, split, map, head, tail, last, path, assocPath, reduce } from 'ramda';

const input = readFileSync('input.txt', { encoding: 'utf-8' }).trim();

const data = pipe(
  split('\n'),
  map(val => JSON.parse(val)),
)(input);

function magnitude(arr) {
  let left = head(arr);
  let right = last(arr);
  if (Array.isArray(left)) {
    left = magnitude(left);
  }
  if (Array.isArray(right)) {
    right = magnitude(right);
  }
  return 3*left + 2*right;
}

function sadd(acc, num) {
  return sreduce([acc, num]);
}

function spaths(num, ps = [], p = []) {
  const l = head(num);
  const r = last(num);
  if (Array.isArray(l)) {
    spaths(l, ps, [...p, 0]);
  } else {
    ps.push([...p, 0]);
  }
  if (Array.isArray(r)) {
    spaths(r, ps, [...p, 1]);
  } else {
    ps.push([...p, 1]);
  }
  return ps;
}

function sreduce(num) {
  let ps;
  while (true) {
    ps = spaths(num);
    let didaction = false;

    // explode
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      if (p.length <= 4) {
        continue;
      }

      // increase value on left
      if (i > 0) {
        num = assocPath(ps[i-1], path(ps[i-1], num) + path(p, num), num);
      }
      // increae value on right
      if (i < ps.length - 2) {
        num = assocPath(ps[i+2], path(ps[i+2], num) + path(ps[i+1], num), num);
      }

      // replace self with 0
      num = assocPath(p.slice(0, -1), 0, num);
      didaction = true;
      break;
    }
    if (didaction) continue;

    // split
    for (const p of ps) {
      const val = path(p, num);
      if (val >= 10) {
        num = assocPath(p, [Math.floor(val / 2), Math.ceil(val / 2)], num);
        didaction = true;
        break;
      }
    }
    if (didaction) continue;

    break;
  }
  return num;
}

{
  let result = null;

  result = magnitude(reduce(sadd, head(data), tail(data)));

  console.log('part 1:', result);
}

{
  let result = null;

  const pairs = [];
  const size = data.length;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i === j) continue;
      pairs.push([i, j]);
    }
  }

  result = pipe(
    map((pair) => magnitude(sadd(data[head(pair)], data[last(pair)]))),
    (mags) => Math.max(...mags),
  )(pairs);

  console.log('part 2:', result);
}

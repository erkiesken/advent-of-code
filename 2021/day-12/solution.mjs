import { readFileSync } from 'fs';
import { pipe, clone, split, map, curry, __ } from 'ramda';

const input = readFileSync('input.txt', { encoding: 'utf-8' }).trim();

const toInt = curry(parseInt)(__, 10);

const data = pipe(
  split('\n'),
  map(split('-')),
)(input);

// console.log(data);

const caves = new Map();

for (const [a, b] of data) {
  caves.set(a, caves.get(a) || new Set());
  caves.set(b, caves.get(b) || new Set());
  caves.get(a).add(b);
  caves.get(b).add(a);
}

console.log(caves);

const lower = new RegExp('^[a-z]+$');
const start = 'start';
const end = 'end';

{
  let result = null;
  const paths = [];

  function walk(name, path, visited) {
    path.push(name);

    if (name == end) {
      paths.push(path);
      return;
    }

    if (lower.test(name)) {
      visited.add(name);
    }

    for (const next of caves.get(name).values()) {
      if (!visited.has(next)) {
        walk(next, clone(path), new Set(visited));
      }
    }
  }

  walk(start, [], new Set());

  result = paths.length;

  console.log('part 1:', result);
}

{
  let result = null;
  const paths = [];

  function walk() {
    const q = [];
    q.push([start, [start], false]);

    while (q.length) {
      const [name, path, twice] = q.pop();

      if (name == end) {
        paths.push(path);
        continue;
      }

      for (const next of caves.get(name).values()) {
        if (next === start) continue;
        if (next === end) {
          q.push([next, [...path, next], twice]);
        } else if (lower.test(next)) {
          if (twice && path.includes(next)) {
            continue;
          }
          q.push([next, [...path, next], twice || path.includes(next)]);
        } else {
          q.push([next, [...path, next], twice]);
        }
      }
    }
  }

  walk();

  result = paths.length;

  console.log('part 2:', result);
}

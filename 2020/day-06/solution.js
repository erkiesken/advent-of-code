const fs = require('fs');
const path = require('path');
const { compose, map, reject, isEmpty, trim, split, replace, sum, reduce, intersection, head, tail, length } = require('ramda');

const input = fs.readFileSync(path.resolve('./input.txt'), 'utf-8');

const data = compose(
  reject(isEmpty),
  map(trim),
  split('\n\n')
)(input);

{
  const result = compose(
    sum,
    map((s) => s.size),
    map((line) => new Set(line.split(''))),
    map(replace(/\n/g, '')),
  )(data);

  console.log('Step 1 result:', result);
}

{
  const a2z = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const result = compose(
    sum,
    map(length),
    map((group) => reduce(intersection, a2z, group)),
    map(map((line) => Array.from(new Set(line.split('')).values()).sort())),
    map(split('\n')),
  )(data);

  console.log('Step 2 result:', result);
}

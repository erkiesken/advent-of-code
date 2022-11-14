import { readFileSync } from 'fs';
import { pipe, sort, reverse, reduce, head, last, sum, split, map, curry, filter, isNil, prop, __ } from 'ramda';

const input = readFileSync('input.txt', { encoding: 'utf-8' }).trim();

const toInt = curry(parseInt)(__, 10);

const data = pipe(
  split('\n'),
  map(split('')),
)(input);

// console.log(data);

const opening = ['(', '[', '{', '<'];
const closing = [')', ']', '}', '>'];
const paired = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
  ')': '(',
  ']': '[',
  '}': '{',
  '>': '<',
};

function check(arr) {
  const stack = [];
  let pos = 0;
  for (const c of arr) {
    if (stack.length === 0 && !opening.includes(c)) {
      return [pos, c];
    }
    if (opening.includes(c)) {
      stack.push(c);
    } else if (closing.includes(c) && stack.pop() !== paired[c]) {
      return [pos, c];
    }
    pos++;
  }
  return [null, stack];
}

{
  let result = null;

  const bad = [];

  for (const line of data) {
    const c = check(line);
    if (c[0] !== null) {
      bad.push(c);
      // console.log(line.join(''));
      // console.log(' '.repeat(c[0]) + c[1]);
    }
  }

  const points = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
  };

  result = pipe(
    map(last),
    map((c) => points[c]),
    sum,
  )(bad);

  console.log('part 1:', result);
}

{
  const points = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
  };

  const scores = pipe(
    map(check),
    filter(pipe(head, isNil)),
    map(last),
    map(map(pipe(
      prop(__, paired),
      prop(__, points),
    ))),
    map(reverse),
    map(reduce((a, c) => (a * 5 + c), 0)),
    sort((a, b) => a - b),
  )(data);

  const result = scores[Math.floor(scores.length / 2)];

  console.log('part 2:', result);
}

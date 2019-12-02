const fs = require('fs');
const path = require('path');
const treis = require('treis');
const { compose, map, reject, isEmpty, trim, split, reduce, add } = require('ramda');

const input = fs.readFileSync(path.resolve('./input.txt'), 'utf-8');

const lines = compose(
  map((n) => parseInt(n, 10)),
  reject(isEmpty),
  map(trim),
  split('\n')
)(input);

const freq = reduce(add, 0, lines);

console.log('part 1 - frequency:', freq);

const freqSet = new Set([0]);

let curr = 0;
let i = 0;
const l = lines.length;
while (true) {
  curr += lines[i % l];
  i += 1;
  if (freqSet.has(curr)) {
    break;
  }
  freqSet.add(curr);
}

console.log('part 2 - found repeating frequency on:', curr);

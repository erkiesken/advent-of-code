const fs = require('fs');
const path = require('path');
const treis = require('treis');
const { compose, map, reject, isEmpty, trim, split, match, filter, equals, length, find } = require('ramda');

const input = fs.readFileSync(path.resolve('./input.txt'), 'utf-8');

const lines = compose(
  reject(isEmpty),
  map(trim),
  split('\n')
)(input);

const claims = map(
  compose(
    ([_, claim, x, y, w, h]) => ({ claim, x: x + 1, y: y + 1, w, h, x2: x + w, y2: y + h }),
    map((n) => parseInt(n, '10')),
    match(/^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/)
  )
)(lines);

const overlap = new Map();

claims.forEach((c) => {
  for (let x = c.x; x <= c.x2; x += 1) {
    for (let y = c.y; y <= c.y2; y += 1) {
      const coord = `${x}:${y}`;
      if (overlap.has(coord)) {
        overlap.set(coord, 'X');
      } else {
        overlap.set(coord, c.claim);
      }
    }
  }
});

const overlapArea = compose(
  length,
  filter(equals('X'))
)(Array.from(overlap.values()));

console.log('part 1 - overlap square inches:', overlapArea);

const isClaimClean = (c) => {
  for (let x = c.x; x <= c.x2; x += 1) {
    for (let y = c.y; y <= c.y2; y += 1) {
      const coord = `${x}:${y}`;
      if (overlap.get(coord) === 'X') {
        return false;
      }
    }
  }
  return true;
};

const result = find(isClaimClean, claims);

console.log('part 2 - non-overlapping claim:', result.claim);

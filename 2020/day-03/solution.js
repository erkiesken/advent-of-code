const fs = require('fs');
const path = require('path');
const { compose, length, map, reject, isEmpty, trim, split, reduce, multiply } = require('ramda');

const input = fs.readFileSync(path.resolve('./input.txt'), 'utf-8');

const data = compose(
  map(split('')),
  reject(isEmpty),
  map(trim),
  split('\n')
)(input);


function checkSlope(data, dx, dy) {
  const rows = length(data);
  const cols = length(data[0]);

  let x = 0;
  let y = 0;
  let total = 0;

  while (y < rows) {
    if (data[y][x] === '#') {
      total += 1;
    }
    y += dy;
    x = (x + dx) % cols;
  }
  return total;
}

{
  const total = checkSlope(data, 3, 1);

  console.log('Part 1 result:', total);
}

{
  const slopes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]];

  const total = compose(
    reduce(multiply, 1),
    map(([x, y]) => checkSlope(data, x, y)),
  )(slopes);

  console.log('Part 2 result:', total);
}

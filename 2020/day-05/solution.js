const fs = require('fs');
const path = require('path');
const { compose, map, reject, isEmpty, trim, split, reduce, add, sort, gt } = require('ramda');

const input = fs.readFileSync(path.resolve('./input.txt'), 'utf-8');

const data = compose(
  reject(isEmpty),
  map(trim),
  split('\n')
)(input);

function getRow(line) {
  return parseInt(
    line
      .substring(0, 7)
      .replace(/F/g, '0')
      .replace(/B/g, '1'),
    2
  );
}
function getCol(line) {
  return parseInt(
    line
      .substring(7)
      .replace(/L/g, '0')
      .replace(/R/g, '1'),
    2
  );
}

function getID(row, col) {
  return row * 8 + col;
}


{
  const result = compose(
    (vals) => Math.max(...vals),
    map((val) => getID(getRow(val), getCol(val))),
  )(data);

  console.log('Step 1 result:', result);
}

{
  const seats = compose(
    sort((a, b) => a - b),
    map((val) => getID(getRow(val), getCol(val))),
  )(data);

  let result = seats[0];

  for (let i = 1; i < seats.length; i++) {
    if ((seats[i] - result) > 1) {
      result = seats[i] - 1;
      break;
    }
    result = seats[i];
  }

  console.log('Step 2 result:', result);
}

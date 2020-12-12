const fs = require('fs');
const path = require('path');
const { compose, pipe, map, reject, isEmpty, trim, split, join, flatten, countBy, identity, prop, range } = require('ramda');

const input = fs.readFileSync(path.resolve('./input.txt'), 'utf-8');

const data = pipe(
  split('\n'),
  map(trim),
  reject(isEmpty),
  map(split('')),
)(input);


function isFloor(data, row, col) {
  return data[row][col] === '.';
}

function isFree(data, row, col) {
  return data[row][col] === 'L';
}

function isOccupied(data, row, col) {
  return data[row][col] === '#';
}

function adjacentOccupied(data, row, col) {
  const val = data[row][col];
  if (val === '.') {
    throw new Error('Should not check floor');
  }
  const rows = data.length;

  let occup = 0;
  if (row > 0) {
    occup += data[row-1][col-1] === '#' ? 1 : 0;
    occup += data[row-1][col] === '#' ? 1 : 0;
    occup += data[row-1][col+1] === '#' ? 1 : 0;
  }
  if (row < data.length - 1) {
    occup += data[row+1][col-1] === '#' ? 1 : 0;
    occup += data[row+1][col] === '#' ? 1 : 0;
    occup += data[row+1][col+1] === '#' ? 1 : 0;
  }
  occup += data[row][col+1] === '#' ? 1 : 0;
  occup += data[row][col-1] === '#' ? 1 : 0;
  return occup;
}

function visCheck(data, row, col) {
  if (isFree(data, row, col)) {
    return [0, true];
  }
  if (isOccupied(data, row, col)) {
    return [1, true];
  }
  return [0, false];
}

function visibleOccupied(data, row, col) {
  const val = data[row][col];
  if (val === '.') {
    throw new Error('Should not check floor');
  }
  const rows = data.length;
  const cols = data[0].length;
  let occup = 0;
  let cnt;
  let br;
  let r;
  let c;

  for (let r = row - 1; r >= 0; r--) {
    [cnt, br] = visCheck(data, r, col);
    occup += cnt;
    if (br) break;
  }
  for (let r = row + 1; r < rows; r++) {
    [cnt, br] = visCheck(data, r, col);
    occup += cnt;
    if (br) break;
  }
  for (let c = col - 1; c >= 0; c--) {
    [cnt, br] = visCheck(data, row, c);
    occup += cnt;
    if (br) break;
  }
  for (let c = col + 1; c < cols; c++) {
    [cnt, br] = visCheck(data, row, c);
    occup += cnt;
    if (br) break;
  }

  r = row - 1;
  c = col - 1;
  while (r >= 0 && c >= 0) {
    [cnt, br] = visCheck(data, r, c);
    occup += cnt;
    if (br) break;
    r--;
    c--;
  }
  r = row - 1;
  c = col + 1;
  while (r >= 0 && c < cols) {
    [cnt, br] = visCheck(data, r, c);
    occup += cnt;
    if (br) break;
    r--;
    c++;
  }
  r = row + 1;
  c = col - 1;
  while (r < rows && c >= 0) {
    [cnt, br] = visCheck(data, r, c);
    occup += cnt;
    if (br) break;
    r++;
    c--;
  }
  r = row + 1;
  c = col + 1;
  while (r < rows && c < cols) {
    [cnt, br] = visCheck(data, r, c);
    occup += cnt;
    if (br) break;
    r++;
    c++;
  }

  return occup;
}

function evolve(src) {
  const dst = JSON.parse(JSON.stringify(src));
  const rows = src.length;
  const cols = src[0].length;
  let changes = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (isFloor(src, row, col)) {
        continue;
      }

      if (isFree(src, row, col) && adjacentOccupied(src, row, col) === 0) {
        dst[row][col] = '#';
        changes++;
      } else if (isOccupied(src, row, col) && adjacentOccupied(src, row, col) >= 4) {
        dst[row][col] = 'L';
        changes++;
      }
    }
  }
  return [dst, changes];
}

function evolve2(src) {
  const dst = JSON.parse(JSON.stringify(src));
  const rows = src.length;
  const cols = src[0].length;
  let changes = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (isFloor(src, row, col)) {
        continue;
      }

      if (isFree(src, row, col) && visibleOccupied(src, row, col) === 0) {
        dst[row][col] = '#';
        changes++;
      } else if (isOccupied(src, row, col) && visibleOccupied(src, row, col) >= 5) {
        dst[row][col] = 'L';
        changes++;
      }
    }
  }
  return [dst, changes];
}

function evolveAll(src, fn) {
  let dst = src;
  let mut;
  let i = 0;
  while (mut !== 0) {
    [dst, mut] = fn(dst);
  }
  return dst;
}

function print(data) {
  pipe(
    map(join('')),
    join('\n'),
    (s) => '\n' + s + '\n',
    console.warn,
  )(data);
}

function countOccupied(data) {
  return pipe(
    flatten,
    countBy(identity),
    prop('#'),
  )(data);
}

{
  const result = countOccupied(evolveAll(data, evolve));
  console.log('Step 1 result:', result);
}

{
  const result = countOccupied(evolveAll(data, evolve2));
  console.log('Step 2 result:', result);
}

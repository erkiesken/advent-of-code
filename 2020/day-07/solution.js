const fs = require('fs');
const path = require('path');
const { compose, map, reject, isEmpty, trim, split, toPairs, fromPairs, flatten, uniq, length, prop, propOr, __, reduce, sum } = require('ramda');

const input = fs.readFileSync(path.resolve('./input.txt'), 'utf-8');

const re = /^(?<count>\d+) (?<color>.+) bags?.?$/;
const data = compose(
  fromPairs,
  map((val) => {
    const [bag, rest] = split(' bags contain ', val);
    if (rest === 'no other bags.') {
      return [bag, {}];
    }
    const bags = compose(
      fromPairs,
      map((item) => {
        const m = re.exec(item);
        return [
          m.groups.color,
          parseInt(m.groups.count, 10),
        ];
      }),
      split(', '),
    )(rest);
    return [bag, bags];
  }),
  reject(isEmpty),
  map(trim),
  split('\n'),
)(input);

const inside = new Map();

for (const [bag, bags] of Object.entries(data)) {
  for (const color of Object.keys(bags)) {
    inside.has(color) ? inside.get(color).add(bag) : inside.set(color, new Set([bag]));
  }
}

function getParents(color) {
  if (inside.has(color)) {
    const arr = Array.from(inside.get(color));
    return [...arr, ...map(getParents, arr)];
  }
  return [];
}

function getChildCount(color, data) {
  const childs = data[color];
  let sum = 1;

  for (const [c, num] of Object.entries(childs)) {
    sum += num * getChildCount(c, data);
  }

  return sum;
}

{
  const result = compose(
    length,
    uniq,
    flatten,
    getParents,
  )('shiny gold');

  console.log('Step 1 result:', result);
}

{
  const result = getChildCount('shiny gold', data) - 1;

  console.log('Step 2 result:', result);
}

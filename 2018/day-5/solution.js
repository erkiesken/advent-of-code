const fs = require('fs');
const path = require('path');
const treis = require('treis');
const { compose, map, reject, isEmpty, trim, split, reduce, add, uniqBy, toLower, replace, gt, sort, head, length } = require('ramda');

const input = fs.readFileSync(path.resolve('./input.txt'), 'utf-8');

const data = trim(input);

const collapsePolymer = (polymer) => {
  for (let i = 0; i < (polymer.length - 1); i = Math.max(i, 0)) {
    const a = polymer[i];
    const b = polymer[i + 1];

    if (a !== b && a.toLowerCase() === b.toLowerCase()) {
      polymer.splice(i, 2);
      // console.log('removed:', a, b, polymer);
      i -= 1;
    } else {
      i += 1;
    }
  }
  return polymer;
};

console.log('part 1 - polymer units remaining:', collapsePolymer(split('', data)).length);

const uniqueTypes = uniqBy(toLower, split('', data));

const polymers = map(
  compose(
    collapsePolymer,
    split(''),
    (type) => replace(new RegExp(`${type}`, 'gi'), '', data)
  )
)(uniqueTypes);

const shortest = compose(
  head,
  sort((a, b) => a - b),
  map(length),
)(polymers);

console.log('part 2 - shortest evolved polymer:', shortest);

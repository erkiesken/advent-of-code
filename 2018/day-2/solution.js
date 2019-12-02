const fs = require('fs');
const path = require('path');
const treis = require('treis');
const { compose, reject, map, trim, split, isEmpty, countBy, identity, toPairs, length, any, filter, equals, last } = require('ramda');

const input = fs.readFileSync(path.resolve('./input.txt'), 'utf-8');

const lines = compose(
  reject(isEmpty),
  map(trim),
  split('\n')
)(input);

const letterCounts = map(
  (id) => ([id, compose(
    toPairs,
    countBy(identity),
    split('')
  )(id)])
)(lines);

const findCountFor = (n, counts) => {
  return compose(
    length,
    filter(
      compose(
        any(compose(equals(n), last)),
        last
      )
    )
  )(counts);
};

const checksum = findCountFor(2, letterCounts) * findCountFor(3, letterCounts);
console.log('part 1 - ID list checksum:', checksum);

const almostSame = (a, b) => {
  const l = a.length;
  let diff = 0;
  for (let i = 0; i < l; i += 1) {
    if (a.charAt(i) !== b.charAt(i)) {
      diff += 1;
    }
    if (diff > 1) {
      break;
    }
  }
  return (diff === 1);
};

const formatAlmostSame = (a, b) => {
  const l = a.length;
  let result = [];
  for (let i = 0; i < l; i += 1) {
    if (a.charAt(i) === b.charAt(i)) {
      result.push(a.charAt(i));
    }
  }
  return result.join('');
};

let candidates = [];

const l = lines.length;
for (let i = 0; i < (l - 1); i += 1) {
  const a = lines[i];
  for (let j = i + 1; j < l; j += 1) {
    const b = lines[j];
    if (almostSame(a, b)) {
      candidates.push(a);
      candidates.push(b);
      break;
    }
  }
}

console.log('part 2 - found ID commonality:', formatAlmostSame(candidates[0], candidates[1]));

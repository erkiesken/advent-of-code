const fs = require('fs');
const path = require('path');
const { compose, filter, length, map, reject, isEmpty, trim, split, reduce, add, countBy, identity, has, gte, lte, prop } = require('ramda');

const input = fs.readFileSync(path.resolve('./input.txt'), 'utf-8');

const RE = /^(\d+)-(\d+) ([a-z]): ([a-z]+)$/;
const lines = compose(
  map((line) => {
    const match = line.match(RE);
    return {
      min: parseInt(match[1], 10),
      max: parseInt(match[2], 10),
      letter: match[3],
      value: match[4],
    };
  }),
  reject(isEmpty),
  map(trim),
  split('\n')
)(input);

{
  const valid = filter((i) => {
    const letters = compose(
      countBy(identity),
      split(''),
    )(i.value);
    return (
      has(i.letter, letters)
        && gte(prop(i.letter, letters), i.min)
        && lte(prop(i.letter, letters), i.max)
    );
  }, lines);

  console.log('Part 1 result:', length(valid));
}

{
  const valid = filter((i) => {
    return (
      (i.value.charAt(i.min - 1) === i.letter
       && i.value.charAt(i.max - 1) !== i.letter)
      || (i.value.charAt(i.min - 1) !== i.letter
       && i.value.charAt(i.max - 1) === i.letter)
    );
  }, lines);

  console.log('Part 2 result:', length(valid));
}

import { readFileSync } from 'fs';
import { pipe, head, split, map, fromPairs, clone, countBy, identity, sortBy, prop, toPairs, last } from 'ramda';

const input = readFileSync('input.txt', { encoding: 'utf-8' }).trim();

const data = pipe(
  split(/\n\n/),
  map(split('\n')),
)(input);

const template = pipe(
  head,
  head,
  split(''),
)(data);

const mapping = pipe(
  last,
  map(split(/ -> /)),
  fromPairs,
  (arr) => new Map(Object.entries(arr)),
)(data);

{
  let result = null;
  let step = 10;
  let chain = clone(template);

  while (step--) {
    const mut = [chain[0]];
    for (let i = 1; i < chain.length; i++) {
      const pair = chain[i-1] + chain[i];
      if (mapping.has(pair)) {
        mut.push(mapping.get(pair));
      }
      mut.push(chain[i]);
    }
    chain = mut;
  }

  result = pipe(
    countBy(identity),
    toPairs,
    sortBy(prop(1)),
    map(last),
    (arr) => last(arr) - head(arr),
  )(chain);

  console.log('part 1:', result);
}

{
  let result = null;
  let step = 40;
  const chain = clone(template);

  let gen = new Map();

  const sums = new Map(Object.entries(countBy(identity, chain)));

  for (let i = 1; i < chain.length; i++) {
    const pair = chain[i-1] + chain[i];
    gen.set(pair, (gen.get(pair) || 0) + 1);
  }

  while (step--) {
    const newgen = new Map();

    for (const [key, val] of gen.entries()) {
      if (!mapping.has(key)) {
        continue;
      }
      const v = mapping.get(key);
      const [a, b] = key.split('', 2);
      const pair1 = a + v;
      const pair2 = v + b;
      sums.set(v, (sums.get(v) || 0) + val);
      newgen.set(pair1, (newgen.get(pair1) || 0) + val);
      newgen.set(pair2, (newgen.get(pair2) || 0) + val);
    }
    gen = newgen;
  }

  result = pipe(
    sortBy(prop(1)),
    map(last),
    (arr) => last(arr) - head(arr),
  )(Array.from(sums.entries()));

  console.log('part 2:', result);
}

import { readFileSync } from 'fs';
import { pipe, split, map, head, tail, fromPairs, intersection, values } from 'ramda';

const input = readFileSync('input.test.txt', { encoding: 'utf-8' }).trim();

const data = pipe(
  split('\n\n'),
)(input);

console.log(data);

{
  let result = null;

  console.log('part 1:', result);
}

{
  let result = null;

  console.log('part 2:', result);
}

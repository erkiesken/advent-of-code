import { readFileSync } from 'fs';
import { clone, mean, median, pipe, split, map, curry, __ } from 'ramda';

const input = readFileSync('input.txt', { encoding: 'utf-8' }).trim();

const toInt = curry(parseInt)(__, 10);

const data = pipe(
  split(','),
  map(toInt),
)(input);

// https://en.wikipedia.org/wiki/Triangular_number
function trinum(n) {
  return (Math.pow(n, 2) + n) / 2;
}

{
  let result = null;

  const pos = clone(data);
  const med = Math.round(median(pos));
  let fuel = 0;

  for (const p of pos) {
    fuel += Math.abs(med - p);
  }

  result = fuel;

  console.log('part 1:', result);
}

{
  let result = null;

  let pos = clone(data);
  let fuel = 0;

  const avg = Math.floor(mean(pos));

  for (const p of pos) {
    fuel += trinum(Math.abs(avg - p));
  }

  result = fuel;

  console.log('part 2:', result);
}

{
  let result = null;

  let pos = clone(data);
  const fuels = [];

  const min = Math.min(...pos);
  const max = Math.max(...pos);
  for (let i = min; i <= max; i++) {
    let fuel = 0;
    for (const p of pos) {
      fuel += trinum(Math.abs(i - p));
    }
    fuels.push(fuel);
  }

  result = Math.min(...fuels);

  console.log('part 2:', result);
}

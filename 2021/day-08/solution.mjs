import { readFileSync } from 'fs';
import { clone, pipe, concat, sum, split, map, join, last, head, difference, length, lt, flatten, filter, includes, equals, sort, curry, __ } from 'ramda';

const input = readFileSync('input.txt', { encoding: 'utf-8' }).trim();

const toInt = curry(parseInt)(__, 10);

const data = pipe(
  split('\n'),
  map(split(/ \| /)),
  map(map(split(' '))),
)(input);


{
  let result = null;

  const digits = pipe(
    map(last),
    map(map(length)),
    flatten,
    filter(curry(includes)(__, [2, 3, 4, 7])),
    length,
  )(data);

  result = digits;

  console.log('part 1:', result);
}

const strdiff = function(a, b) { return a.localeCompare(b); };

{
  const M = new Map();
  M.set('ABCEFG', '0');
  M.set('CF', '1');
  M.set('ACDEG', '2');
  M.set('ACDFG', '3');
  M.set('BCDF', '4');
  M.set('ABDFG', '5');
  M.set('ABDEFG', '6');
  M.set('ACF', '7');
  M.set('ABCDEFG', '8');
  M.set('ABCDFG', '9');

  let result = [];

  const digits = pipe(
    map(map(map(split('')))),
  )(data);

  for (let item of digits) {
    // find 8
    const d8 = pipe(
      head,
      filter(pipe(length, equals(7))),
      head,
    )(item);
    const d1 = pipe(
      head,
      filter(pipe(length, equals(2))),
      head,
    )(item);
    const d4 = pipe(
      head,
      filter(pipe(length, equals(4))),
      head,
    )(item);
    const d7 = pipe(
      head,
      filter(pipe(length, equals(3))),
      head,
    )(item);
    const m = new Map();

    m.set('A', head(difference(d7, d1)));
    m.set('G', pipe(
      head,
      // candidates with 1 missing
      filter(pipe(length, equals(6))),
      map(difference(__, concat(d4, d7))),
      // look up 9
      filter(pipe(length, equals(1))),
      // remaining is bottom bar
      head,
      head,
    )(item));
    m.set('D', pipe(
      head,
      filter(pipe(length, equals(5))),
      map(difference(__, concat(d7, [m.get('G')]))),
      filter(pipe(length, equals(1))),
      head,
      head,
    )(item));
    m.set('B', pipe(
      head,
      filter(pipe(length, equals(6))),
      map(difference(__, [].concat(d7, [m.get('G'), m.get('D')]))),
      filter(pipe(length, equals(1))),
      head,
      head,
    )(item));
    m.set('F', pipe(
      head,
      filter(pipe(length, equals(5))),
      map(difference(__, [m.get('A'), m.get('B'), m.get('D'), m.get('G')])),
      filter(pipe(length, equals(1))),
      head,
      head,
    )(item));
    m.set('C', head(difference(d1, [m.get('F')])));
    m.set('E', head(difference(split('','abcdefg'), Array.from(m.values()))));

    // reverse into lookup map
    const l = new Map();
    for (const [key, val] of m.entries()) {
      l.set(val, key);
    }

    const conv = pipe(
      last,
      map(map(c => l.get(c))),
      map(sort(strdiff)),
      map(join('')),
      map((val) => M.get(val)),
      join(''),
      toInt,
    )(item);

    result.push(conv)
  }

  console.log('part 2:', sum(result));
}

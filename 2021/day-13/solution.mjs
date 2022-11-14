import { readFileSync } from 'fs';
import { pipe, flatten, filter, head, last, join, take, equals, split, map, sum, curry, replace, __ } from 'ramda';

const input = readFileSync('input.txt', { encoding: 'utf-8' }).trim();

const toInt = curry(parseInt)(__, 10);

const data = pipe(
  split(/\n\n/),
  map(split('\n')),
)(input);

const dots = map(
  pipe(
    split(','),
    map(toInt)
  )
)(data[0]);

const folds = pipe(
  map(pipe(
    replace('fold along ', ''),
    split('='),
  )),
  map((v) => [v[0], toInt(v[1])]),
)(data[1]);

function print(paper) {
  console.log(pipe(
    map(join('')),
    join('\n'),
    replace(/0/g, ' '),
    replace(/1/g, '#'),
  )(paper));
}

function foldpaper(paper, dir, value) {
  if (dir == 'y') {
    for (let offy = value + 1; offy < paper.length; offy++) {
      let y = value - (offy - value);
      for (let x = 0; x < paper[0].length; x++) {
        paper[y][x] = paper[y][x] || paper[offy][x];
      }
    }
    paper = take(value, paper);
  } else {
    for (let offx = value + 1; offx < paper[0].length; offx++) {
      let x = value - (offx - value);
      for (let y = 0; y < paper.length; y++) {
        paper[y][x] = paper[y][x] || paper[y][offx];
      }
    }
    paper = map(take(value), paper);
  }
  return paper;
}

const maxx = pipe(
  filter(pipe(head, equals('x'))),
  map(last),
  a => Math.max(...a),
)(folds);
const maxy = pipe(
  filter(pipe(head, equals('y'))),
  map(last),
  a => Math.max(...a),
)(folds);

{
  let result = null;

  let paper = Array(maxy * 2 + 1).fill(0).map(() => Array(maxx * 2 + 1).fill(0));
  for (const dot of dots) {
    paper[dot[1]][dot[0]] = 1;
  }

  for (const fold of folds) {
    paper = foldpaper(paper, fold[0], fold[1]);
    break;
  }

  result = pipe(
    flatten,
    sum,
  )(paper);

  console.log('part 1:', result);
}

{
  let paper = Array(maxy * 2 + 1).fill(0).map(() => Array(maxx * 2 + 1).fill(0));
  for (const dot of dots) {
    paper[dot[1]][dot[0]] = 1;
  }

  for (const fold of folds) {
    paper = foldpaper(paper, fold[0], fold[1]);
  }

  console.log('part 2:');
  print(paper);
}

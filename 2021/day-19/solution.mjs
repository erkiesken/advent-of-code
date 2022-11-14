import { readFileSync } from 'fs';
import { vec3 } from 'gl-matrix';
import { pipe, curry, __, split, map, head, tail, fromPairs, intersection, values } from 'ramda';

const toInt = curry(parseInt)(__, 10);

const input = readFileSync('input.test.txt', { encoding: 'utf-8' }).trim();

const data = pipe(
  split('\n\n'),
  map(pipe(
    split('\n'),
    (arr) => {
      const id = parseInt(/(\d+)/.exec(head(arr))[0], 10);
      const coords = pipe(
        tail,
        map(pipe(split(','), map(toInt))),
      )(arr);
      return [id, coords];
    },
  )),
  fromPairs,
)(input);

console.log(data);

{
  let result = null;
  const v0 = vec3.create();

  function distances(coords) {
    const size = coords.length;
    const dists = {};
    for (let i = 0; i < size; i++) {
      for (let j = i + 1; j < size; j++) {
        dists[`${i}:${j}`] = vec3.distance(
          vec3.fromValues(...coords[i]),
          vec3.fromValues(...coords[j]),
        ).toFixed(3);
      }
    }
    return dists;
  }

  console.log(values(distances(data['2'])).length);
  console.log(intersection(
    values(distances(data['4'])),
    values(distances(data['2'])),
  ).length);

  const rotations = [
    [[1,0,0],[0,0,-1],[0,1,0]],
    [[0,0,1],[0,1,0],[-1,0,0]],
    [[0,-1,0],[1,0,0],[0,0,1]],
  ];

  console.log('part 1:', result);
}

{
  let result = null;

  console.log('part 2:', result);
}

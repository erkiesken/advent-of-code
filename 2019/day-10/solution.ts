import { readFileStrSync } from 'https://deno.land/std@v0.25.0/fs/read_file_str.ts';
import { vec2 }  from 'https://unpkg.com/gl-matrix@3.1.0/esm/index.js';

type vec2 = Float32Array;

function parse(s:string) {
  return s.trim().split('\n').map((val) => val.split(''));
}

const input = readFileStrSync('input.txt');

type Sight = { xy: string, len: number };

function getAsteroidViews(data):Map<string, Map<string, Sight[]>> {
  const w = data[0].length;
  const h = data.length;
  const asteroids = new Map<string, Map<string, Sight[]>>();
  for (let yo = 0; yo < h; yo += 1) {
    for (let xo = 0; xo < w; xo += 1) {
      if (data[yo][xo] !== '#') {
        continue;
      }
      const views = new Map<string, Sight[]>();
      asteroids.set(`${xo}:${yo}`, views);
      for (let yi = 0; yi < h; yi += 1) {
        for (let xi = 0; xi < w; xi += 1) {
          if (yo === yi && xo === xi) {
            // skip self
            continue;
          }
          if (data[yi][xi] === '#') {
            const vec: vec2 = vec2.fromValues(xi - xo, yo - yi);
            const xy = `${xi}:${yi}`;
            let angle: number = vec2.angle(vec, vec2.fromValues(0, 1));
            if (vec[0] < 0) {
              angle = 2 * Math.PI - angle;
            }
            const key = `${angle.toFixed(8)}`;
            const vals: Sight[] = views.get(key) || [];
            views.set(key, [...vals, { xy, len: vec2.length(vec) }]);
          }
        }
      }
    }
  }
  return asteroids;
}

function findBestViews(data): { best: string, max: number, asteroids: Map<string, Map<string, Sight[]>>} {
  let max = -Infinity;
  let best = '';
  const asteroids = getAsteroidViews(data);
  for (let [key, value] of asteroids.entries()) {
    if (value.size > max) {
      max = value.size;
      best = key;
    }
  }
  return { best, max, asteroids };
}

function part1(data) {
  let { best, max } = findBestViews(data);
  console.log(`Best location ${best} max asteroids: ${max}`);
}
function part2(data) {
  let { best, max, asteroids } = findBestViews(data);

  type Target = [string, Sight[]];

  const targets: Target[] = Array.from(asteroids.get(best).entries());
  targets.sort((a, b) => {
    if (a[0] < b[0]) {
      return -1;
    } else if (a[0] > b[0]) {
      return 1;
    }
    return 0;
  });

  for (let t of targets) {
    const s = t[1];
    s.sort((a, b) => {
      if (a.len < b.len) {
        return -1;
      } else if (a.len > b.len) {
        return 1;
      }
      return 0;
    })
  }

  let idx = 0;
  let i = 0;
  let match: Sight;
  while (true) {
    match = targets[i][1].shift();
    if (match) {
      idx += 1;
      // console.log(`${idx} targetted ${match.xy} toward ${targets[i][0]}`);
    }
    if (idx === 200) {
      break;
    }
    i = (i + 1) % targets.length;
  }

  function getValue(s) {
    const parts = s.split(':');
    return parseInt(parts[0], 10) * 100 + parseInt(parts[1]);
  }

  console.log(`200th match is at ${match.xy}, result ${getValue(match.xy)}`);
}

part1(parse(`
.#..#
.....
#####
....#
...##
`));
part1(parse(`
......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####
`));
part1(parse(`
#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.
`));

part1(parse(`
.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..
`));

part1(parse(`
.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##
`));
part2(parse(`
.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##
`));

part1(parse(input));
part2(parse(input));


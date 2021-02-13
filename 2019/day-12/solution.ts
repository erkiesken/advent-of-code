import { readFileStrSync } from 'https://deno.land/std@v0.25.0/fs/read_file_str.ts';

function int(s: string) {
  return parseInt(s, 10);
}

type Moon = {
  position: number[],
  velocity: number[],
};

function parse(input: string): Moon[] {
  const re = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/;
  return input
    .trim()
    .split('\n')
    .map((val) => {
      const m = re.exec(val);
      m.shift();
      const a = m.map(int);
      return {
        position: a,
        velocity: [0,0,0],
      };
    });
}

const data = parse(readFileStrSync('input.txt'));

function copy(data: Moon[]): Moon[] {
  return JSON.parse(JSON.stringify(data));
}

const pairs = [
  [0,1],
  [0,2],
  [0,3],
  [1,2],
  [1,3],
  [2,3],
];

function simulate(moons: Moon[]) {
  for (let [a, b] of pairs) {
    const A = moons[a];
    const B = moons[b]
    if (A.position[0] < B.position[0]) {
      A.velocity[0] = A.velocity[0] + 1;
      B.velocity[0] = B.velocity[0] - 1;
    } else if (A.position[0] > B.position[0]) {
      A.velocity[0] = A.velocity[0] - 1;
      B.velocity[0] = B.velocity[0] + 1;
    }
    if (A.position[1] < B.position[1]) {
      A.velocity[1] = A.velocity[1] + 1;
      B.velocity[1] = B.velocity[1] - 1;
    } else if (A.position[1] > B.position[1]) {
      A.velocity[1] = A.velocity[1] - 1;
      B.velocity[1] = B.velocity[1] + 1;
    }
    if (A.position[2] < B.position[2]) {
      A.velocity[2] = A.velocity[2] + 1;
      B.velocity[2] = B.velocity[2] - 1;
    } else if (A.position[2] > B.position[2]) {
      A.velocity[2] = A.velocity[2] - 1;
      B.velocity[2] = B.velocity[2] + 1;
    }
  }
  for (let moon of moons) {
    moon.position[0] = moon.position[0] + moon.velocity[0];
    moon.position[1] = moon.position[1] + moon.velocity[1];
    moon.position[2] = moon.position[2] + moon.velocity[2];
  }
  return moons;
}

function energy(moons: Moon[]) {
  return moons.reduce((total, moon) => (
    total
      + moon.position.reduce((acc, val) => acc + Math.abs(val), 0)
      * moon.velocity.reduce((acc, val) => acc + Math.abs(val), 0)
  ), 0);
}

{
  const moons = parse(`
<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>
`);
  for (let i = 1; i <= 100; i++) {
    simulate(moons);
  }

  console.log(energy(moons));
}

{
  const moons = copy(data);

  for (let i = 1; i <= 1000; i++) {
    simulate(moons);
  }

  console.log(energy(moons));
}


function moonsEqual(a: Moon, b: Moon, i: number) {
  return (a.position[i] === b.position[i] && a.velocity[i] === b.velocity[i]);
}

// https://en.wikipedia.org/wiki/Greatest_common_divisor
function greatestCommonDivisor(x: number, y: number) {
	while (y !== 0) {
		[x, y] = [y, x % y];
	}
	return x;
}

// https://en.wikipedia.org/wiki/Least_common_multiple
function leastCommonMultiple(a: number, b: number, ...rest: number[]): number {
	let result = a * b / greatestCommonDivisor(a, b);

	for (let i=0; i < rest.length; i += 1) {
		result = leastCommonMultiple(result, rest[i]);
	}

	return result;
}

const test = parse(`
<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>
`);

{
  const state = new Map<string, Set<string>>();
  const start = copy(data);
  const moons = copy(data);

  const counters = [0, 0, 0];
  const done = [false, false, false];
  let allEqual = false;

  while (!allEqual) {
    simulate(moons);
    for (let c = 0; c < 3; c += 1) {
      if (!done[c]) {
        let eq = true;
        for (let j = 0; j < moons.length; j += 1) {
          if (!moonsEqual(moons[j], start[j], c)) {
            eq = false;
          }
        }
        if (eq) {
          done[c] = true;
        } else {
          counters[c] += 1;
        }
      }
    }
    allEqual = done[0] && done[1] && done[2];
  }
  for (let c = 0; c < counters.length; c += 1) {
    counters[c] += 1;
  }

  const step = leastCommonMultiple(counters[0], counters[1], counters[2]);

  console.log(`Repeating state found at step: ${step}`);
}

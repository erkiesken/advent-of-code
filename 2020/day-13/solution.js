const fs = require('fs');
const path = require('path');
const { compose, pipe, map, reject, isEmpty, trim, split, head, last, equals, inc } = require('ramda');

const input = fs.readFileSync(path.resolve('./input.txt'), 'utf-8');

const data = pipe(
  split('\n'),
  map(trim),
  reject(isEmpty),
  (rows) => ({
    arrival: parseInt(head(rows), 10),
    schedule: pipe(
      split(','),
      map((val) => val !== 'x' ? parseInt(val, 10) : val),
    )(last(rows)),
  }),
)(input);

function solve1(arrival, schedule) {
  let ts = arrival;

  while (true) {
    for (let bus of schedule) {
      if (ts % bus === 0) {
        const wait = ts - arrival;
        // console.log('matching bus', ts, bus, wait);
        return wait * bus;
      }
    }
    ts++;
  }
}

{
  const result = solve1(data.arrival, reject(equals('x'), data.schedule));
  console.log('Step 1 result:', result);
}

function solveMMI(a, mod) {
  const b = a % mod;
  for (let x = 1n; x < mod; x++) {
    if ((b * x) % mod === 1n) {
      return x;
    }
  }
  return 1n;
}

function solveCRT(system) {
  const prod = system.reduce((p, con) => p * con.n, 1n);
  return system.reduce((sm, con) => {
    const p = prod / con.n;
    return sm + (con.a * solveMMI(p, con.n) * p);
  }, 0n) % prod;
}

{
  // https://en.wikipedia.org/wiki/Chinese_remainder_theorem
  const congruents = data.schedule
        .map((val, i) => ({ val, i }))
        .filter(({ val }) => val !== 'x')
        .map(({ val, i }) => ({
          n: BigInt(val),
          a: BigInt(val - i)
        }));

  const result = solveCRT(congruents);
  console.log('Step 2 result:', result);
}

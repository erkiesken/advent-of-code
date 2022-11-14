import { readFileSync } from 'fs';

const input = readFileSync('input.txt').toString().trim();

const data = input
      .split(',').map(item => parseInt(item, 10));

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}

{
  let result = null;
  let days = 80;

  const fish = clone(data);

  while (days--) {
    for (let [i, v] of fish.entries()) {
      if (v <= 0) {
        fish.push(9);
        v = 7;
      }
      v -= 1;
      fish[i] = v;
    }
  }

  result = fish.length;

  console.log('part 1:', result);
}

{
  let result = null;
  const days = 256;
  let day = 0;

  const fish = clone(data);
  const gens = new Map();
  for (let i = 0; i < 9; i++) {
    gens.set(i, 0);
  }

  let g = new Map(gens);
  for (const v of fish) {
    g.set(v, g.get(v) + 1);
  }

  while (day++ < days) {
    const newg = new Map();
    for (let i = 8; i >= 0; i--) {
      if (i == 0) {
        newg.set(6, g.get(i) + g.get(7));
        newg.set(8, g.get(i));
      } else {
        newg.set(i-1, g.get(i));
      }
    }
    g = newg;
  }

  result = Array.from(g.values()).reduce((c, v) => c + v, 0);

  console.log('part 2:', result);
}

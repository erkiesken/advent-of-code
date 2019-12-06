import { readFileStrSync } from 'https://deno.land/std@v0.25.0/fs/read_file_str.ts';

const data = readFileStrSync('input.txt').split('\n').map((val) => val.split(')'));

const orbits = new Map();

for (let pair of data) {
  if (pair.length === 2) {
    orbits.set(pair[1], pair[0]);
  }
}

console.log(orbits);

let total = 0;
let parent: string;

for (let key of orbits.keys()) {
  total += 1;
  parent = orbits.get(key);
  while (parent !== 'COM') {
    total += 1;
    parent = orbits.get(parent);
  }
}
console.log(`Total orbits: ${total}`);

const youChain = [];
{
  let parent = orbits.get('YOU');
  while (parent !== 'COM') {
    youChain.push(parent);
    parent = orbits.get(parent);
  }
}
const sanChain = [];
{
  let parent = orbits.get('SAN');
  while (parent !== 'COM') {
    sanChain.push(parent);
    parent = orbits.get(parent);
  }
}

// console.log(youChain, sanChain);

let transfers = 0;
for (let item of youChain) {
  const found = sanChain.indexOf(item);
  if (found >= 0) {
    console.log('found at', transfers, found, sanChain[found], item);
    transfers += found;
    break;
  }
  transfers += 1;
}

console.log(`Total transfers needed: ${transfers}`);

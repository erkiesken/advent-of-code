import { readFileSync } from 'fs';

const input = readFileSync('input.txt').toString();

const data = input.split('\n').map((item) => parseInt(item, 10));

{
  let c = 0;
  let last = Infinity;
  for (const item of data) {
    if (last < item) {
      c += 1;
    }
    last = item;
  }
  console.log('part 1:', c);
}

{
  const slices = [];
  for (let i = 2; i < data.length; i++) {
    slices.push(data[i-2] + data[i-1] + data[i]);
  }
  let c = 0;
  let last = Infinity;
  for (const item of slices) {
    if (last < item) {
      c += 1;
    }
    last = item;
  }
  console.log('part 2:', c);
}

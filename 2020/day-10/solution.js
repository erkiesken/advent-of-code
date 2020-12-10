const fs = require('fs');
const path = require('path');
const { compose, pipe, map, reject, isEmpty, trim, split } = require('ramda');

const input = fs.readFileSync(path.resolve('./input.txt'), 'utf-8');

const data = pipe(
  split('\n'),
  map(trim),
  reject(isEmpty),
  map((line) => parseInt(line, 10)),
)(input);

data.sort((a, b) => a - b);

{
  const counts = new Map();
  const items = [0, ...data, Math.max(...data) + 3];
  let last = items[0];

  for (let i=1; i < items.length; i++) {
    const diff = items[i] - last;
    counts.set(diff, counts.has(diff) ? counts.get(diff) + 1 : 1);
    last = items[i];
  }

  const result = counts.get(1) * counts.get(3);

  console.log('Step 1 result:', result);
}


function tribonacci(num) {
  const tribs = [0, 0, 1];
  let l;
  while (tribs.length <= num) {
    l = tribs.length;
    tribs.push(tribs[l-1] + tribs[l-2] + tribs[l-3]);
  }
  return tribs[num];
}

{
  const items = [0, ...data, Math.max(...data) + 3];
  let chunk = [items[0]];
  const chunks = [chunk];

  for (let i = 1; i < items.length; i++) {
    if ((items[i] - 1) === items[i - 1]) {
      chunk.push(items[i]);
    } else {
      chunk = [items[i]];
      chunks.push(chunk);
    }
  }

  const sizes = chunks.map((chunk) => tribonacci(chunk.length + 1));

  // console.log('chunks', chunks);
  // console.log('sizes', sizes);

  const result = sizes.reduce((acc, val) => acc * val, 1);

  console.log('Step 2 result:', result);
}

const fs = require('fs');
const path = require('path');
const { compose, pipe, map, reject, isEmpty, trim, split, sort, filter, gt, uniq, any } = require('ramda');

const input = fs.readFileSync(path.resolve('./input.txt'), 'utf-8');

const data = pipe(
  split('\n'),
  map(trim),
  reject(isEmpty),
  map((line) => parseInt(line, 10)),
)(input);

{
  function xmasCheck(data, size = 25) {
    let idx = size;

    while (idx < data.length) {
      const val = data[idx];
      const chunk = data.slice(idx - size, idx);
      const valid = pipe(
        sort((a, b) => a - b),
        filter(gt(val)),
        uniq,
      )(chunk);
      const pairs = valid.flatMap(
        (v, i) => valid.slice(i + 1).map( w => [v, w])
      );

      const match = any(([a, b]) => (a + b) === val, pairs);

      if (!match) {
        // console.log(idx, val, chunk, valid, pairs);
        return val;
      }

      idx += 1;
    }

    return null;
  }
  const result = xmasCheck(data, 25);

  console.log('Step 1 result:', result);
}

{
  function findWeakness(data, size) {
    const check = xmasCheck(data, size);
    let end;
    let chunk;
    let val;

    outer:
    for (let start = 0; start < data.length - 1; start++) {
      for (end = start + 2; end <= data.length; end++) {
        chunk = data.slice(start, end);
        val = chunk.reduce((acc, val) => acc + val, 0);
        if (val < check) {
          continue;
        } else if (val > check) {
          continue outer;
        }
        let min = Math.min(...chunk);
        let max = Math.max(...chunk);

        return min + max;
      }
    }

    return null;
  }

  const result = findWeakness(data, 25);

  console.log('Step 2 result:', result);
}

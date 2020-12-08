const fs = require('fs');
const path = require('path');
const { compose, pipe, map, reject, isEmpty, trim, split } = require('ramda');

const input = fs.readFileSync(path.resolve('./input.txt'), 'utf-8');

const data = pipe(
  split('\n'),
  map(trim),
  reject(isEmpty),
  map(pipe(
    split(' '),
    ([cmd, num]) => [cmd, parseInt(num, 10)],
  )),
)(input);

// console.log(data);

{
  const seen = new Set();
  let acc = 0;
  let idx = 0;
  let cmd;
  let num;

  while (!seen.has(idx)) {
    seen.add(idx);
    [cmd, num] = data[idx];
    if (cmd === 'jmp') {
      idx = idx + num;
    } else if (cmd === 'acc') {
      acc += num;
      idx += 1;
    } else if (cmd === 'nop') {
      idx += 1;
    } else {
      throw new Error(`Unknown command: ${cmd} ${num}`);
    }
  }

  const result = acc;

  console.log('Step 1 result:', result);
}

{
  function run(data) {
    const seen = new Set();
    let acc = 0;
    let idx = 0;
    let cmd;
    let num;

    while (!seen.has(idx) && idx < data.length) {
      seen.add(idx);
      [cmd, num] = data[idx];
      if (cmd === 'jmp') {
        idx = idx + num;
      } else if (cmd === 'acc') {
        acc += num;
        idx += 1;
      } else if (cmd === 'nop') {
        idx += 1;
      } else {
        throw new Error(`Unknown command: ${cmd} ${num}`);
      }
    }

    if (idx >= data.length) {
      return acc;
    }
    return null;
  }

  let fix = 0;
  let result = null;

  while (result === null) {
    while (data[fix][0] === 'acc' && fix < data.length) {
      fix += 1;
    }
    const [cmd, num] = data[fix];
    result = run([
      ...data.slice(0, fix),
      [cmd === 'nop' ? 'jmp' : 'nop', num],
      ...data.slice(fix + 1)
    ]);
    fix += 1;
  }

  console.log('Step 2 result:', result);
}

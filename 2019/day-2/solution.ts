import { assertEquals } from 'https://deno.land/std@v0.25.0/testing/asserts.ts';
import { readFileStrSync } from 'https://deno.land/std@v0.25.0/fs/read_file_str.ts';

const data = readFileStrSync('input.txt').split(',').map((val) => parseInt(val, 10));

console.log(data);

function run(state) {
  let pos = 0;
  let op = state[pos];

  while (op !== 99) {
    // console.log(`pos: ${pos} op: ${op}`);
    if (op === 1) {
      const arg1 = state[state[pos + 1]];
      const arg2 = state[state[pos + 2]];
      state[state[pos + 3]] = arg1 + arg2;
    } else if (op === 2) {
      const arg1 = state[state[pos + 1]];
      const arg2 = state[state[pos + 2]];
      state[state[pos + 3]] = arg1 * arg2;
    } else {
      throw new Error(`Unknown op code at position {$pos}: ${op}`);
    }
    pos = pos + 4;
    op = state[pos];
  }

  return state;
}

const alarmState = [...data];
alarmState[1] = 12;
alarmState[2] = 2;

const result = run(alarmState);

console.log(result);


const expectedResult = 19690720;
let noun, verb;

outer:
for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 100; j++) {
    console.log(`Looking for: ${i}, ${j}`);
    const candidate = [...data];
    candidate[1] = i;
    candidate[2] = j;
    const result = run(candidate);

    if (result[0] === expectedResult) {
      noun = i;
      verb = j;
      break outer;
    }
  }
}

console.log(`Expected noun/verb ${noun}, ${verb} value: ${100 * noun + verb}`);


import { assertEquals } from 'https://deno.land/std@v0.25.0/testing/asserts.ts';
import { readFileStrSync } from 'https://deno.land/std@v0.25.0/fs/read_file_str.ts';

type State = number[];

const data: State = readFileStrSync('input.txt').split(',').map((val) => parseInt(val, 10));

interface Step {
  op: number;
  param1?: number;
  mode1?: number;
  param2?: number;
  mode2?: number;
  param3?: number;
  mode3?: number;
}

function read(state: State, pos: number): [Step, number] {
  const instr = state[pos];
  let offset = pos + 1;
  const step: Step = {
    op: instr % 100,
    mode1: Math.floor(instr / 100) % 2,
    mode2: Math.floor(instr / 1000) % 2,
    mode3: Math.floor(instr / 10000) % 2,
  };
  if (step.op === 1 || step.op === 2 || step.op === 7 || step.op === 8) {
    step.param1 = state[pos + 1];
    step.param2 = state[pos + 2];
    step.param3 = state[pos + 3];
    offset = pos + 4;
  } else if (step.op === 3 || step.op === 4) {
    step.param1 = state[pos + 1];
    offset = pos + 2;
  } else if (step.op === 5 || step.op === 6) {
    step.param1 = state[pos + 1];
    step.param2 = state[pos + 2];
    offset = pos + 3;
  }
  return [step, offset];
}

function readValue(mode: number, value: number, state: State) {
  if (mode === 1) {
    return value;
  }
  return state[value];
}

function run(state: number[], input: number) {
  let pos = 0;
  let step: Step;
  let slot = input;

  [step, pos] = read(state, pos);

  while (step.op !== 99) {
    // console.log(step, pos);
    if (step.op === 1) {
      const arg1 = readValue(step.mode1, step.param1, state);
      const arg2 = readValue(step.mode2, step.param2, state);
      state[step.param3] = arg1 + arg2;
    } else if (step.op === 2) {
      const arg1 = readValue(step.mode1, step.param1, state);
      const arg2 = readValue(step.mode2, step.param2, state);
      state[step.param3] = arg1 * arg2;
    } else if (step.op === 3) {
      state[step.param1] = slot;
    } else if (step.op === 4) {
      slot = state[step.param1];
    } else if (step.op === 5) {
      if (readValue(step.mode1, step.param1, state) !== 0) {
        pos = readValue(step.mode2, step.param2, state);
      }
    } else if (step.op === 6) {
      if (readValue(step.mode1, step.param1, state) === 0) {
        pos = readValue(step.mode2, step.param2, state);
      }
    } else if (step.op === 7) {
      const left = readValue(step.mode1, step.param1, state);
      const right = readValue(step.mode2, step.param2, state);
      state[step.param3] = (left < right) ? 1 : 0;
    } else if (step.op === 8) {
      const left = readValue(step.mode1, step.param1, state);
      const right = readValue(step.mode2, step.param2, state);
      state[step.param3] = (left === right) ? 1 : 0;
    } else {
      throw new Error(`Unknown op code at position ${pos}: ${step.op}`);
    }
    [step, pos] = read(state, pos);
  }

  return [state, slot];
}

{
  const state = [...data];
  const [result, output] = run(state, 1);
  console.log(output);
}

{
  const state = [...data];
  const [result, output] = run(state, 5);
  console.log(output);
}

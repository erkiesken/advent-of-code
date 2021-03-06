import { readFileStrSync } from 'https://deno.land/std@v0.25.0/fs/read_file_str.ts';

type State = number[];

const data:State = readFileStrSync('input.txt')
  .trim()
  .split(',')
  .map((val) => parseInt(val, 10));

interface Step {
  op: number;
  param1?: number;
  mode1?: number;
  param2?: number;
  mode2?: number;
  param3?: number;
  mode3?: number;
}

interface RunState {
  state: number[];
  position: number;
  relative: number;
  phase: number;
  input: number;
  output: number;
  initialized: boolean;
  finished: boolean;
  index: number;
}

function read(state: State, pos: number): [Step, number] {
  const instr = state[pos];
  let offset = pos + 1;
  const step: Step = {
    op: instr % 100,
    mode1: Math.floor(instr / 100) % 10,
    mode2: Math.floor(instr / 1000) % 10,
    mode3: Math.floor(instr / 10000) % 10,
  };
  if (step.op === 1 || step.op === 2 || step.op === 7 || step.op === 8) {
    step.param1 = state[pos + 1];
    step.param2 = state[pos + 2];
    step.param3 = state[pos + 3];
    offset = pos + 4;
  } else if (step.op === 3 || step.op === 4 || step.op === 9) {
    step.param1 = state[pos + 1];
    offset = pos + 2;
  } else if (step.op === 5 || step.op === 6) {
    step.param1 = state[pos + 1];
    step.param2 = state[pos + 2];
    offset = pos + 3;
  }
  return [step, offset];
}

function readValue(mode: number, value: number, run: RunState) {
  if (mode === 1) { // immediate mode
    return value;
  } else if (mode === 2) { // relative mode
    return run.state[run.relative + value];
  }
  return run.state[value]; // position mode
}
function writeValue(mode: number, value: number, run: RunState, result: number) {
  if (mode === 2) { // relative mode
    run.state[run.relative + value] = result;
  } else { // position mode
    run.state[value] = result;
  }
}

function run(run: RunState) {
  const state = run.state;
  let pos = run.position;
  let step: Step;

  [step, pos] = read(state, pos);
  run.position = pos;

  while (step.op !== 99) {
    if (pos < 0) {
      throw new Error(`Negative memory position referenced: ${pos}`);
    }
    // console.log(step.op, step, pos);
    if (step.op === 1) {
      const arg1 = readValue(step.mode1, step.param1, run);
      const arg2 = readValue(step.mode2, step.param2, run);
      writeValue(step.mode3, step.param3, run, arg1 + arg2);
    } else if (step.op === 2) {
      const arg1 = readValue(step.mode1, step.param1, run);
      const arg2 = readValue(step.mode2, step.param2, run);
      writeValue(step.mode3, step.param3, run, arg1 * arg2);
    } else if (step.op === 3) {
      writeValue(step.mode1, step.param1, run, run.input);
    } else if (step.op === 4) {
      const value = readValue(step.mode1, step.param1, run);
      if (value === undefined ){
        throw new Error(`Can not have undefined output`);
      }
      run.output = value;
      return;
    } else if (step.op === 5) {
      if (readValue(step.mode1, step.param1, run) !== 0) {
        pos = readValue(step.mode2, step.param2, run);
      }
    } else if (step.op === 6) {
      if (readValue(step.mode1, step.param1, run) === 0) {
        pos = readValue(step.mode2, step.param2, run);
      }
    } else if (step.op === 7) {
      const left = readValue(step.mode1, step.param1, run);
      const right = readValue(step.mode2, step.param2, run);
      writeValue(step.mode3, step.param3, run, (left < right) ? 1 : 0);
    } else if (step.op === 8) {
      const left = readValue(step.mode1, step.param1, run);
      const right = readValue(step.mode2, step.param2, run);
      writeValue(step.mode3, step.param3, run, (left === right) ? 1 : 0);
    } else if (step.op === 9) {
      const value = readValue(step.mode1, step.param1, run);
      run.relative += value;
    } else {
      throw new Error(`Unknown op code at position ${pos}: ${step.op}`);
    }
    [step, pos] = read(state, pos);
    run.position = pos;
  }
  run.finished = true;
  return run;
}

const defaults = {
  state: [],
  position: 0,
  relative: 0,
  phase: 0,
  input: 0,
  output: 0,
  initialized: false,
  finished: false,
  index: 0,
};

const memory = (new Array(1_000_000)).fill(0);

// {
//   const test: RunState = {
//     ...defaults,
//     input: 1,
//     state: [109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99,...memory],
//   };
//   while (!test.finished) {
//     if (!run(test)) {
//       console.log(`output: ${test.output} (at ${test.position})`);
//     }
//   }
//   console.log(`final output: ${test.output}`);
// }

// {
//   const test: RunState = {
//     ...defaults,
//     input: 1,
//     state: [1102,34915192,34915192,7,4,7,99,0,...memory],
//   };
//   while (!test.finished) {
//     run(test);
//     console.log(`output: ${test.output} (at ${test.position})`);
//   }
// }

// {
//   const test: RunState = {
//     ...defaults,
//     input: 1,
//     state: [104,1125899906842624,99,...memory],
//   };
//   while (!test.finished) {
//     run(test);
//     console.log(`output: ${test.output} (at ${test.position})`);
//   }
// }

{
  const test: RunState = {
    ...defaults,
    input: 1,
    state: [...data, ...memory],
  };
  while (!test.finished) {
    if (!run(test)) {
      console.log(`output: ${test.output} (at ${test.position})`);
    }
  }
  console.log(`final output: ${test.output}`);
}

{
  const test: RunState = {
    ...defaults,
    input: 2,
    state: [...data, ...memory],
  };
  while (!test.finished) {
    if (!run(test)) {
      console.log(`output: ${test.output} (at ${test.position})`);
    }
  }
  console.log(`final output: ${test.output}`);
}

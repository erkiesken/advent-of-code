import { readFileStrSync } from 'https://deno.land/std@v0.25.0/fs/read_file_str.ts';
import { run, read, readValue, Step } from '../day-5/solution.ts';

const data = readFileStrSync('input.txt').split(',').map((val) => parseInt(val, 10));

function perm(xs) {
  let ret = [];
  for (let i = 0; i < xs.length; i = i + 1) {
    let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));
    if(!rest.length) {
      ret.push([xs[i]])
    } else {
      for(let j = 0; j < rest.length; j = j + 1) {
        ret.push([xs[i]].concat(rest[j]))
      }
    }
  }
  return ret;
}

{
  let maxOutput = -Infinity;

  const phases = perm([0,1,2,3,4]);
  for (let phase of phases) {
    let output = 0;
    let _;
    for (let i = 0; i < 5; i++) {
      const result = run([...data], phase[i], output);
      output = result[1];
    }
    maxOutput = Math.max(maxOutput, output);
  }

  console.log(`Max thruster output: ${maxOutput}`);
}

interface RunState {
  state: number[];
  position: number;
  phase: number;
  input: number;
  output: number;
  initialized: boolean;
  finished: boolean;
  index: number;
}

function run2(run: RunState) {
  const state = run.state;
  let pos = run.position;
  let step: Step;

  [step, pos] = read(state, pos);
  run.position = pos;

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
      if (!run.initialized) {
        run.initialized = true;
        state[step.param1] = run.phase;
      } else {
        state[step.param1] = run.input;
      }
    } else if (step.op === 4) {
      run.output = state[step.param1];
      return;
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
    run.position = pos;
  }
  run.finished = true;
  return run;
}


{
  let maxOutput = -Infinity;

  const defaults = { position: 0, phase: 0, input: 0, output: 0, initialized: false, finished: false };
  const phases = perm([5,6,7,8,9]);

  for (let phase of phases) {
    const amps: RunState[] = [
      { state: [...data], ...defaults, phase: phase[0], index: 0 },
      { state: [...data], ...defaults, phase: phase[1], index: 1 },
      { state: [...data], ...defaults, phase: phase[2], index: 2 },
      { state: [...data], ...defaults, phase: phase[3], index: 3 },
      { state: [...data], ...defaults, phase: phase[4], index: 4 },
    ];
    const last = amps[amps.length - 1];

    let i = 0;
    while (!last.finished) {
      const amp = amps[i];
      run2(amp);
      if (amp === last) {
        amps[0].input = amp.output;
      } else {
        amps[i + 1].input = amp.output;
      }
      i = (i + 1) % amps.length;
    }

    maxOutput = Math.max(maxOutput, last.output);
  }

  console.log(`Max total thruster output: ${maxOutput}`);
}

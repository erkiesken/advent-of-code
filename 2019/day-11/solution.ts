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

const turnLeft = {
  '^': '<',
  '<': 'v',
  'v': '>',
  '>': '^',
};
const turnRight = {
  '^': '>',
  '<': '^',
  'v': '<',
  '>': 'v',
};

{
  const hull = new Map<string, number>();
  let x = 0;
  let y = 0;
  let xy = `${x}:${y}`;
  let mode = 'paint';
  let dir = '^';
  hull.set(xy, 1);

  const painter: RunState = {
    ...defaults,
    input: hull.get(xy),
    state: [...data],
  };
  while (!painter.finished) {
    if (!run(painter)) {
      if (mode === 'paint') {
        xy = `${x}:${y}`;
        hull.set(xy, painter.output);
        console.log(`painter ${xy}`, painter.output);
        mode = 'move';
      } else if (mode === 'move') {
        if (painter.output === 0) {
          console.log('turning left');
          dir = turnLeft[dir];
        } else if (painter.output === 1) {
          console.log('turning right');
          dir = turnRight[dir];
        }
        if (dir === '^') {
          y -= 1;
        } else if (dir === 'v') {
          y += 1;
        } else if (dir === '<') {
          x -= 1;
        } else if (dir === '>') {
          x += 1;
        }
        xy = `${x}:${y}`;
        painter.input = hull.get(xy) || 0;
        console.log(`new input at ${xy}`, painter.input);
        mode = 'paint';
       }
    }
  }

  console.log(`Visited and painted tiles: ${hull.size}`);

  const paint = new Array(64 * 64).fill(0);
  for (let [key, value] of hull.entries()) {
    const [x, y] = key.split(':');
    paint[parseInt(y, 10) * 64 + parseInt(x, 10)] = value;
  }

  for (let i = 0; i < paint.length; i += 64) {
    console.log(
      paint
        .slice(i, i + 64)
        .join('')
        .replace(/0/g, '\u001b[40m ') // black
        .replace(/1/g, '\u001b[47m ') // white
    );
  }
}

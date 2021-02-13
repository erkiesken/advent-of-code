import { readFileSync} from 'fs';
import { AStarFinder } from 'astar-typescript';

type State = number[];

function parse(s: string) {
  return s.trim().split(',').map((val) => parseInt(val, 10));
}
function copy<T>(data: T): T  {
  return JSON.parse(JSON.stringify(data));
}

const input:State = parse(readFileSync('input.txt', { encoding: 'utf-8' }));

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

type Area = number[][];

function makeArea(w, h, val = 0) {
  const a = [];
  while (h--) {
    a.push(new Array(w).fill(val));
  }
  return a;
}

function print(area: Area, target: [number, number], dir: string) {
  const mapping = {
    35: '#', // scaffold
    46: '.', // space
  };

  for (let y = 0; y < area.length; y += 1) {
    console.log(
      area[y].map((val, x) => {
        if (x === target[0] && y === target[1]) {
          return dir;
        }
        return mapping[val];
      }).join('')
    );
  }
}

// function areaToWalkable(area: Area) {
//   return area.map((row) => row.map((val) => (val === 1 || val === 2) ? 0 : 1));
// }

{
  const w = 48;
  const h = 48;
  const area = makeArea(w, h, 3);
  let target: [number, number];
  let x = 0;
  let y = 0;
  let dir;

  const bot: RunState = {
    ...defaults,
    input: 1,
    state: [...input],
  };
  while (!bot.finished) {
    if (!run(bot)) {
      // console.log(`output: ${bot.output} (at ${bot.position})`);
      if (bot.output === 35 || bot.output === 46) {
        area[y][x] = bot.output;
        x += 1;
      } else if (bot.output === 10) {
        y += 1;
        x = 0;
      } else if ([60, 62, 94, 118].includes(bot.output)) {
        dir = String.fromCharCode(bot.output);
        area[y][x] = 35;
        target = [x, y];
        x += 1;
      } else {
        throw new Error(`Unknown output at postition ${bot.position}, x: ${x}, y: ${y}`);
      }
    }
  }
  console.log('\x1B[2J\x1B[H');
  print(area, target, dir);
  console.log('Target:', target, dir);

  {
    let sum = 0;
    for (let y = 1; y < h - 2; y += 1) {
      for (let x = 1; x < w - 2; x += 1) {
        if (area[y][x] === 35 && area[y-1][x] === 35 && area[y+1][x] === 35 && area[y][x-1] === 35 && area[y][x+1] === 35) {
          console.log(`crossing at ${x} ${y}`);
          sum += x * y;
        }
      }
    }
    console.log(`Alignment parameter sum: ${sum}`);
  }
}

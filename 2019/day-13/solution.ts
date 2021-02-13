import { readFileStrSync } from 'https://deno.land/std@v0.25.0/fs/read_file_str.ts';

type State = number[];

function parse(s: string) {
  return s.trim().split(',').map((val) => parseInt(val, 10));
}

const data:State = parse(readFileStrSync('input.txt'));

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


function print(board: number[][]) {
  const mapping = [
    '\u001b[40m ', // black
    '\u001b[47m ', // white
    '■', // wall
    '―', // horiz paddle
    '●', // ball
  ];

  for (let i = 0; i < board.length; i += 1) {
    console.log(
      board[i].map((val) => mapping[val]).join('')
    );
  }
}


{
  const state = [...data];
  state[0] = 2;
  const game: RunState = {
    ...defaults,
    state,
  };

  const w = 44;
  const h = 24;
  const board = new Array();
  for (let i=0; i < h; i += 1) {
    board.push(new Array(w).fill(0))
  };

  let idx = 0;
  let x: number;
  let y: number;
  let t: number;
  let score = 0;
  let paddle = { x: 0, y: 0 };
  let ball = { x: 0, y: 0 };

  while (!game.finished) {
    if (!run(game)) {
      // console.log(`output: ${game.output} (at ${game.position})`);

      if (idx === 0) {
        x = game.output;
      } else if (idx === 1) {
        y = game.output;
      } else if (idx === 2) {
        t = game.output;
        if (x === -1 && y === 0) {
          score = t;
        } else {
          board[y][x] = t;
        }
        if (t === 4) {
          ball = { x, y };
        }
        if (t === 3) {
          paddle = { x, y };
        }
      }

      idx = (++idx) % 3;

      if (board[h-2][w-2] === 1) {
        console.log('\x1B[2J\x1B[H');
        print(board);
      }
    }

    if (ball.x < paddle.x) {
      game.input = -1;
    } else if (ball.x > paddle.x) {
      game.input = 1;
    } else {
      game.input = 0;
    }
  }

  const blocks = board.filter((val) => val === 2).length;
  console.log(`block tiles total: ${blocks}`);

  console.log(`final score: ${score}`);

  print(board);
  console.log(board);

}

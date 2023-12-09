import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";
import lcm from "npm:@stdlib/math-base-special-lcm";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const toInt = (val: string) => parseInt(val, 10);
const tapConsole = R.tap(console.debug);

function parse(data: string) {
  return R.pipe(
    R.split("\n\n"),
    ([head, rest]) => {
      const dirs = R.split("", head);
      const maps = R.pipe(
        R.split("\n"),
        R.map(R.pipe(
          R.split(" = "),
          ([id, pairs]) => ([
            id,
            {
              L: pairs.slice(1, 4),
              R: pairs.slice(6, 9),
            }
          ]),
        )),
        R.fromPairs,
      )(rest);
      return { dirs, maps };
    },
  )(data);
}

function* steps(vals: string[]) {
  let i = 0;
  while (true) {
    yield vals[i];
    i++;
    if (i >= vals.length) {
      i = 0;
    }
  }
}

function* steps2(vals: string[]) {
  let i = 0; // index that wraps over to start
  let c = 1; // total count
  while (true) {
    yield [vals[i], i, c++];
    i++;
    // wrap to start
    if (i >= vals.length) {
      i = 0;
    }
  }
}

{
  const { dirs, maps } = parse(input);

  let curr = "AAA";
  let next;
  let count = 0;
  for (const step of steps(dirs)) {
    if (curr === "ZZZ") {
      break;
    }
    count++;
    next = maps[curr];
    if (curr === next.R && next.R === next.L) {
      console.log("Got stuck at:", curr, next);
      break;
    }
    curr = next[step];
  }

  console.log("part 1:", count);
}

{
  const { dirs, maps } = parse(input);

  let currents = R.pipe(
    R.keys,
    R.filter(
      // starts with all values ending in 'A'
      R.pipe(R.last, R.equals("A")),
    ),
  )(maps);

  // finds all ending conditions for each starting position
  const ending = [];
  let i = 0;
  outer:
  for (let curr of currents) {
    const m = new Map();
    ending.push(m);
    let next;
    for (const step of steps2(dirs)) {
      next = maps[curr][step[0]];
      // can end if last char is 'Z'
      if (next.endsWith("Z")) {
        const id = `${next}:${step[1]}`;
        if (m.has(id)) {
          // already seen it at this index, so end it
          continue outer;
        }
        // mark it ending at index, remember counter
        m.set(id, step[2]);
      }
      curr = next;
    }
  }

  const count = R.pipe(
    R.map(m => Array.from(m.values())),
    R.flatten,
    // find least common multiple
    R.reduce(lcm, 1),
  )(ending);

  console.log("part 2:", count);
}

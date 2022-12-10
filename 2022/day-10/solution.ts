import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.txt").trim();

const toInt = (val: string) => parseInt(val, 10);

type Step = [string, number];

const data: Step[] = R.pipe(
  R.split("\n"),
  R.map(R.pipe(R.split(" "), (s:string[]) => [s[0], toInt(s[1])])),
)(input);

{
  let reg = 1;
  const stops = [20, 60, 100, 140, 180, 220];
  let next = stops.shift();
  const signals = [];
  const steps = [...data];

  let c = 0;
  let w = 0;
  let x = 0;
  while (++c && next) {
    if (w == 0) {
      const step = steps.shift();
      if (step == undefined) {
        console.log("out of steps", c);
        break;
      } else if (step[0] == "addx") {
        x = step[1];
        w = 2;
      } else if (step[0] == "noop") {
        x = 0;
        w = 0;
      }
    }

    if (c == next) {
      next = stops.shift();
      signals.push(reg * c);
    }

    w = Math.max(0, w-1);
    if (w == 0) {
      reg += x;
    }
  }

  console.log("part 1:", R.sum(signals));
}

{
  let reg = 1;
  const screen: string[][] = [];
  const steps = [...data];

  let c = 0;
  let w = 0;
  let x = 0;
  let row:string[] = [];
  while (true) {
    if (w == 0) {
      const step = steps.shift();
      if (step == undefined) {
        console.log("out of steps", c);
        break;
      } else if (step[0] == "addx") {
        x = step[1];
        w = 2;
      } else if (step[0] == "noop") {
        x = 0;
        w = 0;
      }
    }

    const p = c % 40;

    if (p == 0) {
      screen.push(row);
      row = [];
    }

    if (p >= (reg - 1) && p <= (reg + 1)) {
      row.push("#");
    } else {
      row.push(" ");
    }

    w = Math.max(0, w-1);
    if (w == 0) {
      reg += x;
    }

    if (++c === 240) {
      screen.push(row);
      row = [];
      break;
    }
  }

  console.log("part 2:", R.pipe(R.map(R.join("")), R.join("\n"))(screen));
}

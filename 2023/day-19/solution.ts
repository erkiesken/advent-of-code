import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const toInt = (val: string) => parseInt(val, 10);
const tapConsole = R.tap(console.debug);

function parseCond(s: string) {
  const all = {
    x: R.always(true),
    m: R.always(true),
    a: R.always(true),
    s: R.always(true),
  };
  if (s.includes(":")) {
    const [cond, next] = R.split(":", s);
    const key = R.slice(0, 1, cond);
    const op = R.slice(1, 2, cond);
    const value = toInt(R.slice(2, Infinity, cond));
    const check = op == "<" ? R.gt(value) : R.lt(value);
    const test = R.pipe(R.prop(key), check);
    return {
      all: { ...all, [key]: check },
      test: R.pipe(R.prop(key), check),
      next,
      cond: s,
    };
  }
  return {
    all,
    test: R.always(true),
    next: s,
    cond: s,
  };
}

function parse(data: string) {
  return R.pipe(
    R.split("\n\n"),
    ([head, tail]) => {
      const flow = R.pipe(
        R.split("\n"),
        R.map(R.pipe(
          R.split("{"),
          ([key, rest]) => [
            key,
            R.pipe(
              R.slice(0, -1),
              R.split(","),
              R.map(parseCond),
            )(rest),
          ],
        )),
        R.fromPairs,
      )(head);
      const parts = R.pipe(
        R.split("\n"),
        R.map(R.pipe(
          R.slice(1, -1),
          R.split(","),
          R.map(R.split("=")),
          R.map(([key, value]) => [key, toInt(value)]),
          R.fromPairs,
        )),
      )(tail);
      return { flow, parts };
    },
  )(data);
}

function checkPart(part, flow) {
  let curr = "in";
  while (true) {
    for (const { test, next, cond } of flow[curr]) {
      if (test(part)) {
        curr = next;
        break;
      }
    }
    if (curr == "A") {
      return true;
    } else if (curr == "R") {
      return false;
    }
  }
  return false;
}

{
  const { flow, parts } = parse(input);

  const sum = R.pipe(
    R.filter((part) => checkPart(part, flow)),
    R.map(R.values),
    R.flatten,
    R.sum,
  )(parts);

  console.log("part 1:", sum);
}

{
  console.log("part 2:", );
}

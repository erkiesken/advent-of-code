import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const toInt = (val: string) => parseInt(val, 10);
const tapConsole = R.tap(console.debug);

function parse(data: string): Condition[] {
  return R.pipe(
    R.split("\n"),
    R.map(R.pipe(
      R.split(" "),
      (val) => ({
        value: R.head(val),
        conditions: R.pipe(R.head, R.split(""))(val),
        counts: R.pipe(R.last, R.split(","), R.map(toInt))(val),
      }),
    )),
  )(data) as Condition[];
}

type Condition = {
  value: string,
  conditions: State[],
  counts: number[],
}

enum State {
  Damaged = "#",
  Operational = ".",
  Unknown = "?",
}

function variants(prefix: string, conds: State[]) {
  let p = prefix;
  const r = [];
  if (!conds.length) {
    return [p];
  }
  const [val, ...rest] = conds;
  if (val == State.Operational || val == State.Damaged) {
    r.push(variants(p + val, rest));
  } else if (val == State.Unknown) {
    r.push(variants(p + ".", rest));
    r.push(variants(p + "#", rest));
  } else {
    throw new Error(`Unknown value ${val}`);
  }
  return R.flatten(r);
}

function countsRE(counts: number[]) {
  let s = "^\\.*?";
  for (const c of counts) {
    s += `#{${c}}\\.+`;
  }
  s = s.slice(0, -3);
  s += "\\.*$";
  return new RegExp(s);
}

{
  const data = parse(input);

  const arrangements = R.pipe(
    R.map(({ counts, value, conditions }) => {
      const re = countsRE(counts);
      return [
        value,
        R.pipe(
          (conds) => variants("", conds),
          R.filter((item) => re.test(item)),
          R.length,
        )(conditions),
      ];
    }),
    R.fromPairs,
    tapConsole,
  )(data);

  console.log("part 1:", R.sum(R.values(arrangements)));
}

{
  console.log("part 2:", );
}

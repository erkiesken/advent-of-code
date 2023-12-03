import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const toInt = (val: string) => parseInt(val, 10);
const tapConsole = R.tap(console.debug);

function isDigit(s: string) {
  return s >= "0" && s <= "9";
}
function isSymbol(s: string) {
  return !isDigit(s) && s != ".";
}
function toKey(x: string, y: string) {
  return `${x}:${y}`;
}
function fromKey(k: string) {
  return R.pipe(
    R.split(":"),
    R.map(toInt),
  )(k);
}
function allAround(pos: string, m: Map) {
  const r = [];
  const [px, py] = fromKey(pos);
  const pl = [
    toKey(px-1, py-1), toKey(px, py-1), toKey(px+1, py-1),
    toKey(px-1, py),                    toKey(px+1, py),
    toKey(px-1, py+1), toKey(px, py+1), toKey(px+1, py+1),
  ];
  for (const p of pl) {
    if (m.has(p)) {
      r.push(m.get(p));
    }
  }
  return r;
}
function anyAround(pos: string, m: Map) {
  return allAround(pos, m).length > 0;
}

function parse(data:string) {
  const nums = new Map();
  const syms = new Map();

  const lines = R.pipe(
    R.split("\n"),
    R.map(R.split("")),
  )(data);

  for (let y = 0; y < lines.length; y++) {
    const l = lines[y];
    const ll = l.length;
    let pl = []; // consequitive number positons list
    let next = -1;
    let num = ""; // collect number parts into this
    for (let x = 0; x < ll; x++) {
      const pos = toKey(x, y);
      const val = l[x];
      if (isDigit(val)) {
        pl.push(pos);
        num += val;
        next = x + 1;
        // look ahead to check if number should end
        if (next == ll || (next < ll && !isDigit(l[next]))) {
          // save unique shared number object for proper deduping later
          const n = { num };
          for (const p of pl) {
            nums.set(p, n);
          }
          // reset collected positions list and number
          pl = [];
          num = "";
        }
      } else if (val == ".") {
        // ignore whitespace
        continue;
      } else if (isSymbol(val)) {
        // collect symbols separately
        syms.set(pos, { sym: val });
      }
    }
  }

  return [nums, syms];
}

{
  const [nums, syms] = parse(input);

  const valid = R.pipe(
    // check if any symbols around
    R.filter(([key, val]) => anyAround(key, syms)),
    R.map(R.last),
    // dedupe based on object equality (see parse)
    (vals) => Array.from(new Set(vals).values()),
    // extract as ints
    R.map(R.pipe(R.prop("num"), toInt)),
  )(Array.from(nums.entries()));

  console.log("part 1:", R.sum(valid));
}

{
  const [nums, syms] = parse(input);

  const gears = R.pipe(
    // only look for gears
    R.filter(([key, val]) => val.sym == "*"),
    // find all neighbouring numbers
    R.map(R.pipe(
      ([key, val]) => allAround(key, nums),
      (vals) => Array.from(new Set(vals).values()),
      R.map(R.pipe(R.prop("num"), toInt)),
    )),
    // only keep ones with 2 neighbours
    R.filter(R.pipe(
      R.length,
      R.equals(2),
    )),
    // calculate gear ratio
    R.map(([a, b]) => a * b),
  )(Array.from(syms.entries()));

  console.log("part 2:", R.sum(gears));
}

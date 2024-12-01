import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const toInt = (val: string) => parseInt(val, 10);
const tapConsole = R.tap(console.debug);

type RowsCols = {
  rows: string[],
  cols: string[],
}

function parse(data: string): RowsCols[] {
  return R.pipe(
    R.split("\n\n"),
    R.map(R.pipe(
      R.split("\n"),
      R.map(R.split("")),
    )),
    R.map((bits) => {
      const rl = bits.length;
      const cl = bits[0].length;
      const rows = [];
      const cols = [];
      for (let r = 0; r < rl; r++) {
        rows.push(bits[r].join(""));
      }
      for (let c = 0; c < cl; c++) {
        let ct = [];
        for (let r = 0; r < rl; r++) {
          ct.push(bits[r][c]);
        }
        cols.push(ct.join(""));
      }
      return { rows, cols };
    }),
  )(data);
}

function findMirror(lines: string[], type): number {
  const rl = lines.length;
  outer:
  for (let r = 1; r < rl; r++) {
    // check if matches with previous
    if (lines[r-1] == lines[r]) {
      // find max delta to check
      const l = Math.min(r, rl - r);
      // check looking back/forward by max delta
      for (const d of R.range(1, l)) {
        if (lines[r - d - 1] !== lines[r + d]) {
          // no match, try next line
          continue outer;
        }
      }
      // found mirror point
      return r;
    }
  }
  return 0;
}

function findSmudgedMirror(lines: string[], type): number[] {
  const rl = lines.length;
  const res = [];
  outer:
  for (let r = 1; r < rl; r++) {
    let df = diff(lines[r-1], lines[r]);
    // check if differs max by 1, means maybe smudge at mirror line
    if (df <= 1) {
      // find max delta to check
      const l = Math.min(r, rl - r);
      // check looking back/forward by max delta
      for (const d of R.range(1, l)) {
        df += diff(lines[r - d - 1], lines[r + d]);
        if (df > 1) {
          // too many diffs so no match, try next line
          continue outer;
        }
      }
      // found mirror point
      res.push(r);
    }
  }
  return res;
}

function diff(a: string, b: string) {
  let d = 0;
  for (const i of R.range(0, a.length)) {
    if (R.nth(i, a) !== R.nth(i, b)) {
      d++;
    }
  }
  return d;
}

function mirrorValue(data: RowsCols): number {
  const { rows, cols } = data;
  const rl = rows.length;
  const cl = cols.length;
  let res = 0;

  res += 100 * findMirror(rows);
  res += findMirror(cols);

  return res;
}

function smudgedMirrorValue(data: RowsCols): number {
  const { rows, cols } = data;
  const rl = rows.length;
  const cl = cols.length;
  let res = 0;

  const rv = findMirror(rows, "r");
  const rvs = findSmudgedMirror(rows, "r");
  const cv = findMirror(cols, "c");
  const cvs = findSmudgedMirror(cols, "c");

  res += 100 * R.pipe(R.reject(R.equals(rv)), R.sum)(rvs);
  res += R.pipe(R.reject(R.equals(cv)), R.sum)(cvs);

  return res;
}

{
  const data = parse(input);

  const summaries = R.pipe(
    R.map(mirrorValue),
  )(data);

  console.log("part 1:", R.sum(summaries));
}

{
  const data = parse(input);

  const summaries = R.pipe(
    R.map(smudgedMirrorValue),
  )(data);

  console.log("part 2:", R.sum(summaries));
}

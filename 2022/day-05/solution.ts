import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.txt");

const toInt = (val: string) => parseInt(val, 10);

const data = R.pipe(
  R.split("\n\n"),
)(input);

function parseStack(input: string): Map<number, string[]> {
  const rows = R.split("\n", input);
  const s = new Map();
  const cols = R.pipe(R.last, R.trim, R.split(/ +/), R.map(toInt))(rows);

  rows.pop();

  for (const c of cols) {
    s.set(c, []);
    for (const r of rows) {
      const v = R.slice(c*4-3, c*4-2)(r);
      if (v === "" || v === " ") {
        continue;
      }
      s.set(c, R.prepend(v, s.get(c)));
    }
  }

  return s;
}

function parseMoves(input: string) {
  const rows: string[] = R.split("\n", input);
  const res = [];
  for (const r of rows) {
    const m = r.match(/move (?<count>\d+) from (?<from>\d+) to (?<to>\d+)/);
    if (m === null) {
      continue;
    }
    res.push([toInt(m.groups!.count), toInt(m.groups!.from), toInt(m.groups!.to)]);
  }
  return res;
}

{
  const stack = parseStack(data[0]);
  const moves = parseMoves(data[1]);

  for (const m of moves) {
    const [count, from, to] = m;
    const fromStack = stack.get(from) as string[];
    const toStack = stack.get(to) as string[];
    for (let i=0; i < count; i++) {
      const item = fromStack.pop() as string;
      toStack.push(item);
    }
  }

  const res = R.map(R.pipe(R.last, R.last))(Array.from(stack.entries()));

  console.log("part 1:", R.join("", res));
}

{
  const stack = parseStack(data[0]);
  const moves = parseMoves(data[1]);

  for (const m of moves) {
    const [count, from, to] = m;
    const fromStack = stack.get(from) as string[];
    const toStack = stack.get(to) as string[];
    stack.set(to, toStack.concat(fromStack.splice(-count, count)));
  }

  const res = R.map(R.pipe(R.last, R.last))(Array.from(stack.entries()));

  console.log("part 2:", R.join("", res));
}

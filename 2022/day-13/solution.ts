import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.txt").trim();

type Signal = number | Signal[];
type Pair = [Signal, Signal];

const data:Pair[] = R.pipe(
  R.split("\n\n"),
  R.map(R.pipe(R.split("\n"), R.map(JSON.parse))),
)(input);

function isOrdered(list: number[]) {
  // look pairwise until clear if smaller/larger
  for (let i = 0; i < list.length; i=i+2) {
    const l = list[i];
    const r = list[i+1];
    if (l < r) {
      return true;
    } else if (l > r) {
      return false;
    }
  }
  return true;
}

function consolidate(left: Signal, right: Signal): number[] {
  if (left === undefined && right === undefined) {
    return [];
  }
  if (Number.isInteger(left) && Number.isInteger(right)) {
    return [Number(left), Number(right)];
  }
  if (Number.isInteger(left) && right === undefined) {
    return [Number(left), -Infinity];
  } else if (Number.isInteger(right) && left === undefined) {
    return [-Infinity, Number(right)];
  }
  if (!Array.isArray(left)) {
    left = [left];
  }
  if (left.length === 0 && right === undefined) {
    return [Infinity, -Infinity];
  }
  if (!Array.isArray(right)) {
    right = [right];
  }
  const res = [];
  const max = Math.max(left.length, right.length);
  for (let i = 0; i < max; i++) {
    res.push(consolidate(left[i], right[i]));
  }
  return R.flatten(res);
}

{
  const ids:number[] = [];

  let id = 1;
  for (const pair of data) {
    if (isOrdered(consolidate(pair[0], pair[1]))) {
      ids.push(id);
    }
    id++;
  }

  console.log("part 1:", R.sum(ids));
}

{
  const div1 = [[2]];
  const div2 = [[6]];
  const d: Signal[] = [div1, div2];
  R.forEach((r: Pair) => { d.push(r[0]); d.push(r[1]) }, data);

  const s: Signal[] = R.sort((a: Signal, b: Signal) => {
    return isOrdered(consolidate(a, b)) === true ? -1 : 1;
  })(d);

  console.log("part 2:", R.multiply(
    R.pipe(R.indexOf(div1), R.inc)(s),
    R.pipe(R.indexOf(div2), R.inc)(s),
  ));
}

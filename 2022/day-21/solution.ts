import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.txt").trim();

const toInt = (val: string) => parseInt(val, 10);

type Data = {
  id: string,
  val?: number,
  op: string,
  left?: string,
  right?: string,
}

const data: Data[] = R.pipe(
  R.split("\n"),
  R.map(R.pipe(
    R.split(": "),
    ([id, v]: string[]) => {
      let left: string;
      let op: string;
      let right: string;
      let val: number;
      if (v.includes(" ")) {
        [left, op, right] = v.split(" ");
      } else {
        val = toInt(v);
      }
      return { id, val, left, op, right };
    }
  )),
)(input);

type MapData = Map<string, Data>;

function solve1(k: string, m: MapData): number {
  const item = m.get(k)!;
  if (!R.isNil(item.val)) {
    return item.val!;
  }

  const left = solve1(item.left!, m);
  const right = solve1(item.right!, m);
  let val: number;
  if (item.op == "+") {
    val = left + right;
  } else if (item.op == "-") {
    val = left - right;
  } else if (item.op == "/") {
    val = left / right;
  } else if (item.op == "*") {
    val = left * right;
  } else {
    throw Error("Unhandled op");
  }

  m.set(k, { ...item, val });
  return val;
}

function walk(path: string[], m: MapData): string[][] {
  const k = R.last(path);
  const item = m.get(k)!;

  if (!R.isNil(item.val)) {
    return [path];
  }

  const left = walk([...path, item.left!], m);
  const right = walk([...path, item.right!], m);

  return [...left, ...right];
}

function expand(k: string, m: MapData): string {
  const item = m.get(k)!;
  if (!R.isNil(item.val)) {
    return `${item.val}`;
  }

  const left = expand(item.left!, m);
  const right = expand(item.right!, m);
  if (item.op == "+") {
    return `(${left}+${right})`;
  } else if (item.op == "-") {
    return `(${left}-${right})`;
  } else if (item.op == "/") {
    return `(${left}/${right})`;
  } else if (item.op == "*") {
    return `(${left}*${right})`;
  } else {
    throw Error("Unhandled op");
  }
}

{
  const m = new Map<string, Data>();
  for (const item of data) {
    m.set(item.id, { ...item });
  }

  solve1("root", m);

  console.log("part 1:", m.get("root")!.val);
}

{
  const m = new Map<string, Data>();
  for (const item of data) {
    m.set(item.id, R.dissoc("id", { ...item }));
  }

  const p = walk(["root"], m);
  const human = R.pipe(
    R.filter(R.includes("humn")),
    R.flatten,
  )(p);

  for (const id of m.keys()) {
    if (R.includes(id, human)) {
      continue;
    }
    solve1(id, m);
  }

  const root = m.get("root")!;
  m.set("humn", { val: "x" });

  console.log(expand(root.left!, m), "=", solve1(root.right!, m));

  // Got to this magic number by feeding expanded expression above to Wolfram Alpha, cheater!
  // https://www.wolframalpha.com/input?i2d=true&i=%5C%2840%2927*%5C%2840%29940%2B%5C%2840%29Divide%5B%5C%2840%2913085427083031-%5C%2840%29Divide%5B%5C%2840%29%5C%2840%29%5C%2840%29%5C%2840%29%5C%2840%29%5C%2840%29Divide%5B%5C%2840%29%5C%2840%29%5C%2840%29%5C%2840%29Divide%5B%5C%2840%29288%2B%5C%2840%29738%2B%5C%2840%29Divide%5B%5C%2840%29%5C%2840%292*%5C%2840%29%5C%2840%292*%5C%2840%29%5C%2840%29Divide%5B%5C%2840%29%5C%2840%29Divide%5B%5C%2840%29369%2B%5C%2840%29%5C%2840%29%5C%2840%29952%2B%5C%2840%29Divide%5B%5C%2840%29%5C%2840%29%5C%2840%29%5C%2840%29%5C%2840%29%5C%2840%29Divide%5B%5C%2840%29956%2B%5C%2840%29102*%5C%2840%29852%2B%5C%2840%29Divide%5B%5C%2840%29%5C%2840%29%5C%2840%29%5C%2840%29Divide%5B%5C%2840%29171%2B%5C%2840%29%5C%2840%29Divide%5B%5C%2840%29%5C%2840%29%5C%2840%29%5C%2840%29%5C%2840%29%5C%2840%29Divide%5B%5C%2840%29865%2B%5C%2840%29Divide%5B%5C%2840%29%5C%2840%292*%5C%2840%29%5C%2840%29Divide%5B%5C%2840%29495%2B%5C%2840%29%5C%2840%29%5C%2840%293*%5C%2840%29%5C%2840%2917*%5C%2840%29%5C%2840%29Divide%5B%5C%2840%29x%2B731%5C%2841%29%2C2%5D%5C%2841%29-366%5C%2841%29%5C%2841%29%2B135%5C%2841%29%5C%2841%29-416%5C%2841%29%2B126%5C%2841%29%5C%2841%29%2C2%5D%5C%2841%29%2B945%5C%2841%29%5C%2841%29-361%5C%2841%29%2C3%5D%5C%2841%29%5C%2841%29%2C2%5D%5C%2841%29-721%5C%2841%29*3%5C%2841%29-438%5C%2841%29*2%5C%2841%29%2B525%5C%2841%29%2C9%5D%5C%2841%29%2B872%5C%2841%29%5C%2841%29%2C7%5D%5C%2841%29-285%5C%2841%29*5%5C%2841%29-613%5C%2841%29%2C9%5D%5C%2841%29%5C%2841%29%5C%2841%29%5C%2841%29%2C2%5D%5C%2841%29-808%5C%2841%29*3%5C%2841%29%2B500%5C%2841%29*2%5C%2841%29-307%5C%2841%29%2C3%5D%5C%2841%29%5C%2841%29*2%5C%2841%29-243%5C%2841%29%5C%2841%29%2C4%5D%5C%2841%29%2B291%5C%2841%29%2C2%5D%5C%2841%29-257%5C%2841%29%5C%2841%29-261%5C%2841%29%5C%2841%29%2B522%5C%2841%29%2C4%5D%5C%2841%29%5C%2841%29%5C%2841%29%2C7%5D%5C%2841%29-240%5C%2841%29*38%5C%2841%29-714%5C%2841%29%2C5%5D%5C%2841%29%2B393%5C%2841%29*2%5C%2841%29%2B914%5C%2841%29*2%5C%2841%29-618%5C%2841%29%2C11%5D%5C%2841%29%5C%2841%29%2C3%5D%5C%2841%29%5C%2841%29%5C%2841%29+%3D+40962717833337%0A
  let i = 3769668716700;

  while (++i) {
    const mm = R.pipe(
      Array.from,
      R.map(([id, item]: [string, Data]) => [id, item.val ? item : R.clone(item)]),
      (v: [string, Data][]) => new Map(v),
    )(m.entries());
    mm.set("humn", { val: i });
    const left = solve1(root.left!, mm);
    const right = solve1(root.right!, mm);
    if (left == right) {
      break;
    }
    if (i % 1000 == 0) {
      console.log(i, left, right, left / right);
    }
  }

  console.log("part 2:", i);
}

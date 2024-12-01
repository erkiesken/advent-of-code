import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const toInt = (val: string) => parseInt(val, 10);
const tapConsole = R.tap(console.debug);

function parse(data:string): string[] {
  return R.split(",", data);
}

function hash(s: string): number {
  let curr = 0;
  let a = 0;

  for (const c of s.split("")) {
    curr += c.charCodeAt(0);
    curr *= 17;
    curr %= 256;
  }
  return curr;
}

{
  const data = parse(input);

  const hashes = R.map(hash, data);

  console.log("part 1:", R.sum(hashes));
}

{
  const data = parse(input);
  const boxes = [];
  for (const i of R.range(0, 256)) {
    boxes.push([]);
  }

  const re = /^(?<l>[^-=]+)(?<op>[-=])(?<v>\d*)$/;
  for (const row of data) {
    const m = row.match(re);
    const l = m.groups.l;
    const lh = hash(l);
    const op = m.groups.op;
    const v = toInt(m.groups.v);
    const box = boxes[lh];
    if (op == "-") {
      boxes[lh] = R.filter((item) => item[0] != l, box);
    } else if (op == "=") {
      const el = R.find((item) => item[0] == l, box);
      if (el == undefined) {
        box.push([l, lh, v]);
      } else {
        el[2] = v;
      }
    }
  }

  const focals = [];
  let bi = 1;
  for (const box of boxes) {
    let si = 1;
    for (const slot of box) {
      focals.push(bi * si * slot[2]);
      si++;
    }
    bi++;
  }

  console.log("part 2:", R.sum(focals));
}

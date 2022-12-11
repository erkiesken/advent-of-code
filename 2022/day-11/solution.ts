import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";
import { lcd } from "https://deno.land/x/denum@v1.2.0/mod.ts";

const input = Deno.readTextFileSync("input.txt");

const toInt = (val: string) => parseInt(val, 10);

type Monkey = {
  items: number[],
  op: (v: number) => number,
  test: (v: number) => boolean,
  testfail: number,
  testpass: number,
  opcount: number,
}

const parse = R.pipe(
  R.split("\n\n"),
  R.map(R.pipe(R.split("\n"), (r: string[]) => {
    const items = R.pipe(
      R.split(":"),
      R.last,
      R.trim,
      R.split(", "),
      R.map(toInt),
    )(r[1]);
    let [op, val] = R.pipe(
      R.split("="),
      R.last,
      R.trim,
      R.split(" "),
      R.tail,
    )(r[2]);
    if (!Number.isNaN(toInt(val))) {
      val = toInt(val);
    }
    if (op == "*") {
      op = (v: number) => Number.isInteger(val) ? (v * val) : (v * v);
    } else if (op == "+") {
      op = (v: number) => Number.isInteger(val) ? (v + val) : (v + v);
    }
    const div = R.pipe(
      R.split(" "),
      R.last,
      toInt,
    )(r[3]);
    const test = (t:number) => (t % div == 0);
    const testpass = R.pipe(
      R.split(" "),
      R.last,
      toInt,
    )(r[4]);
    const testfail = R.pipe(
      R.split(" "),
      R.last,
      toInt,
    )(r[5]);
    return { items, op, div, test, testpass, testfail, opcount: 0 };
  })),
);

{
  const monkeys: Monkey[] = parse(input);
  let r = 1;

  while (r <= 20) {
    for (const m of monkeys) {
      const items = m.items;
      m.items = [];

      for (const i of items) {
        let v = m.op(i);
        m.opcount += 1;
        v = Math.floor(v / 3);
        monkeys[m.test(v) ? m.testpass : m.testfail].items.push(v);
      }
    }

    r++;
  }

  console.log("part 1:", R.pipe(
    R.map(R.prop("opcount")),
    R.sort((a:number, b:number) => b - a),
    R.take(2),
    ([a, b]: number[]) => a * b,
  )(monkeys));
}

{
  const monkeys: Monkey[] = parse(input);
  let r = 1;

  const divs = R.pipe(R.map(R.prop("div")))(monkeys);
  const d = lcd(...divs);

  while (r <= 10_000) {
    for (const m of monkeys) {
      const items = m.items;
      m.items = [];

      for (const i of items) {
        let v = m.op(i);
        v = v % d;
        m.opcount += 1;
        monkeys[m.test(v) ? m.testpass : m.testfail].items.push(v);
      }
    }

    r++;
  }
  console.log("part 2:", R.pipe(
    R.map(R.prop("opcount")),
    R.sort((a:number, b:number) => b - a),
    R.take(2),
    ([a, b]: number[]) => a * b,
  )(monkeys));
}

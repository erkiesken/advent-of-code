import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.txt").trim();

const data:string[] = R.pipe(
  R.split("\n"),
)(input);

const snafuDecode: { [key: string]: number } = {
  "=": -2,
  "-": -1,
  "0": 0,
  "1": 1,
  "2": 2,
};
const snafuEncode: { [key: string]: string } = {
  "-2": "=",
  "-1": "-",
  "0": "0",
  "1": "1",
  "2": "2",
};

type Snafu = number[];

function decode(s: string): Snafu {
  return R.pipe(
    R.split(""),
    R.map((v: string) => snafuDecode[v]),
  )(s);
}

function encode(s: Snafu): string {
  return R.pipe(
    R.map((v: number) => snafuEncode[String(v)]),
    (a: string[]) => {
      // strip leading zeroes
      while (a[0] == "0") {
        a.shift();
      }
      return a;
    },
    R.join(""),
  )(s);
}

function fromSnafu(v: string): number {
  const s = R.reverse(decode(v));
  const a: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const n = s[i];
    const p = Math.pow(5, i);
    a.push(n * p);
  }
  return R.sum(a);
}

function toSnafu(n: number): string {
  const m = new Map<number, number>();
  for (let i = 19; i >= 0; i--) {
    const p = Math.pow(5, i);
    const r = Math.floor(n / p);
    m.set(i, r);
    n = n % p;
  }
  for (let i = 0; i < 19; i++) {
    const r = m.get(i) || 0;
    if (r >= 3) {
      m.set(i, -5 + r);
      m.set(i+1, (m.get(i+1) || 0) + 1);
    }
  }
  return encode(Array.from(m.values()));
}

{
  console.log("part 1:", R.pipe(
    R.map(fromSnafu),
    R.sum,
    toSnafu,
  )(data));
}

{
  console.log("part 2:", "");
}

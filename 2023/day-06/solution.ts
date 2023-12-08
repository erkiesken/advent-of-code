import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const toInt = (val: string) => parseInt(val, 10);
const tapConsole = R.tap(console.debug);

type Game = {
  time: number,
  dist: number,
  speed: number,
}

function parse(data: string): Game[] {
  return R.pipe(
    R.split("\n"),
    R.map(R.pipe(
      R.split(/[: ]+/),
      ([head, ...tail]) => ([R.toLower(head), R.map(toInt, tail)]),
    )),
    R.fromPairs,
    ({ time, distance }) => R.pipe(
      R.range(0),
      R.map((i) => ({ time: time[i], dist: distance[i], speed: 0 })),
    )(time.length),
  )(data);
}

function parse2(data: string) {
  return R.pipe(
    R.split("\n"),
    R.map(R.pipe(
      R.replace(/ +/g, ""),
      R.split(":"),
      ([head, ...tail]) => ([R.toLower(head), R.map(toInt, tail)]),
    )),
    R.fromPairs,
    ({ time, distance }) => R.pipe(
      R.range(0),
      R.map((i) => ({ time: time[i], dist: distance[i], speed: 0 })),
    )(time.length),
  )(data);
}

function play(g: Game): Game[] {
  let c = 0;
  let t = g.time;
  let s = g.speed;
  while (t > 0) {
    t--;
    s++;
    if (t * s > g.dist) {
      c++;
    }
  }
  return c;
}

{
  const games = parse(input);

  const val = R.pipe(
    R.map(play),
    R.reduce(R.multiply, 1),
  )(games);

  console.log("part 1:", val);
}

{
  const games = parse2(input);

  const val = R.pipe(
    R.map(play),
    R.reduce(R.multiply, 1),
  )(games);

  console.log("part 2:", val);
}

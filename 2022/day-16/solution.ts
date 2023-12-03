import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.test.txt").trim();

const toInt = (val: string) => parseInt(val, 10);

type Input = { valve: string, rate: number, valves: string[] }

const lineRE = /Valve (?<valve>\w+) has flow rate=(?<rate>\d+); tunnels? leads? to valves? (?<valves>[A-Z, ]+)/;
const data: Input[] = R.pipe(
  R.split("\n"),
  R.map(R.pipe(
    (v:string) => v.match(lineRE)!.groups,
    R.evolve({
      rate: toInt,
      valves: R.split(", "),
    }),
  )),
)(input);

console.log(data);

{
  const start = "AA";

  console.log("part 1:", );
}

{
  console.log("part 2:", );
}

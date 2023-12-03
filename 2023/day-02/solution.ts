import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const toInt = (val: string) => parseInt(val, 10);
const tapConsole = R.tap(console.debug);

type DiceSet = {
  red: Number,
  blue: Number,
  green: Number,
}

type Game = {
  id: string,
  sets: DiceSet[],
}

function parseGames(data: string):Game[] {
  return R.pipe(
    R.split("\n"),
    R.map(R.pipe(
      R.split(": "),
      (vals) => {
        return {
          id: R.pipe(
            R.head,
            R.split(" "),
            R.last,
            toInt
          )(vals),
          sets: R.pipe(
            R.last,
            R.split("; "),
            R.map(R.pipe(
              R.split(", "),
              R.map(R.pipe(
                R.split(" "),
                ([val, key]) => {
                  return [key, toInt(val)];
                }
              )),
              R.fromPairs,
              R.mergeRight({ red: 0, blue: 0, green: 0 }),
            )),
          )(vals),
        } as Game;
      }
    )),
  )(data);
}

{
  const games = parseGames(input);

  const maxPreds = {
    red: R.gt(R.__, 12),
    green: R.gt(R.__, 13),
    blue: R.gt(R.__, 14),
  };

  const validGames = R.pipe(
    R.filter(R.pipe(
      R.prop("sets"),
      R.filter(R.whereAny(maxPreds)),
      R.pipe(R.length, R.equals(0)),
    )),
    R.map(R.prop("id")),
  )(games);

  console.log("part 1:", R.sum(validGames));
}

{
  const games = parseGames(input);

  const maxes = R.pipe(
    R.map(R.pipe(
      R.prop("sets"),
      R.reduce((acc, val) => {
        return {
          red: R.max(acc.red, val.red),
          blue: R.max(acc.blue, val.blue),
          green: R.max(acc.green, val.green),
        };
      }, { red: 0, blue: 0, green: 0 }),
      ({ red, blue, green }) => (red * blue * green),
    )),
  )(games);

  console.log("part 2:", R.sum(maxes));
}

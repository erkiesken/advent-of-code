import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const toInt = (val: string) => parseInt(val, 10);
const tapConsole = R.tap(console.debug);

function parse(data: string) {
  const parts = R.split("\n\n", data);
  const seeds = R.pipe(
    R.head,
    R.split(" "),
    R.tail,
    R.map(toInt),
  )(parts);

  const ranges = R.pipe(
    R.tail,
    R.map(R.pipe(
      R.split("\n"),
      ([head, ...tail]) => {
        const id = R.pipe(R.split(" "), R.head)(head);
        const ranges = R.map(R.pipe(
          R.split(" "),
          R.map(toInt),
        ))(tail);
        return [id, ranges];
      }
    )),
    R.fromPairs,
  )(parts);
  return { seeds, ranges }
}

function mapToRange(value: number, ranges: number[][]) {
  const range = R.find((r) => {
    return value >= r[1] && value <= (r[1] + r[2]);
  }, ranges);
  if (R.isNil(range)) {
    return value;
  }
  return range[0] + (value - range[1]);
}

function mapThroughRanges_(value: number, ranges) {
  const mapped = R.curry(mapToRange);
  return R.pipe(
    mapped(R.__, ranges["seed-to-soil"]),
    mapped(R.__, ranges["soil-to-fertilizer"]),
    mapped(R.__, ranges["fertilizer-to-water"]),
    mapped(R.__, ranges["water-to-light"]),
    mapped(R.__, ranges["light-to-temperature"]),
    mapped(R.__, ranges["temperature-to-humidity"]),
    mapped(R.__, ranges["humidity-to-location"]),
  )(value);
}

const mapKeys = [
  "seed-to-soil",
  "soil-to-fertilizer",
  "fertilizer-to-water",
  "water-to-light",
  "light-to-temperature",
  "temperature-to-humidity",
  "humidity-to-location",
];

function mapThroughRanges(value: number, ranges) {
  for (const key of mapKeys) {
    value = mapToRange(value, ranges[key]);
  }
  return value;
}

{
  const { seeds, ranges } = parse(input);

  const locations = R.pipe(
    R.map((val) => mapThroughRanges(val, ranges)),
  )(seeds);

  console.log("part 1:", Math.min.apply(null, locations));
}

{
  const { seeds, ranges } = parse(input);

  const mapping = R.pipe(
    R.toPairs,
    R.map(([id, ranges]) => {
      ranges = R.pipe(
        R.map(([dest, src, len]) => [src, src + len - 1, dest - src]),
        R.sort((a, b) => (a[0] > b[0]) ? 1 : -1),
        (all) => {
          const r = [];
          let last;
          r.push([-Infinity, R.pipe(R.head, R.head)(all) - 1, 0]);
          for (let item of all) {
            r.push(item);
            if (last && item[0] - last[1] > 1) {
              r.push([last[1] + 1, item[0] - 1, 0]);
            }
            last = item;
          }
          r.push([R.pipe(R.last, R.head)(all) + 1, Infinity, 0]);
          return r;
        },
      )(ranges);
      return [id, ranges];
    }),
    R.fromPairs,
  )(ranges);

  const locations = R.pipe(
    R.splitEvery(2),
    R.map(([start, len]) => {
      const end = start + len - 1;
      let min = Infinity;
      for (let i = start; i <= end; i++) {
        if (i % 10_000_000 == 0) {
          console.log('start', start, (i - start) / len);
        }
        let val = i;
        keyloop:
        for (const key of mapKeys) {
          for (let m of mapping[key]) {
            if (val >= m[0] && val <= m[1]) {
              val = val + m[2];
              continue keyloop;
            }
          }
          throw new Error(`No mapping for i=${i} key=${key} val=${val}`);
        }
        min = Math.min(min, val);
      }
      return min;
    }),
  )(seeds);

  console.log("part 2:", Math.min.apply(null, locations));
}

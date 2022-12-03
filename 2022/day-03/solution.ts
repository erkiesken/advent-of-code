import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.txt").trim();

const data = R.pipe(
  R.split("\n"),
  R.map(
    R.pipe(
      R.split(""),
      R.map((s:string) => {
        if (s <= "Z") {
          return s.charCodeAt(0) - 65 + 27;
        }
        return s.charCodeAt(0) - 96;
      }),
      (a:string[]) => [R.slice(0, R.length(a) / 2, a), R.slice(R.length(a) / 2, Infinity, a)],
    )
  ),
)(input);

{
  console.log("part 1:", R.pipe(
    R.map((v) => R.intersection(R.head(v), R.last(v))),
    R.flatten,
    R.sum,
  )(data));
}

{
  console.log("part 2:", R.pipe(
    R.splitEvery(3),
    R.map(R.map(R.pipe(R.flatten, R.uniq))),
    R.map((trio) => {
      return R.intersection(R.intersection(trio[2], trio[1]), trio[0]);
    }),
    R.flatten,
    R.sum,
  )(data));
}

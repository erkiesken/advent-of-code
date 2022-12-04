import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.txt").trim();

const toInt = (val: string) => parseInt(val, 10);

const data: number[][] = R.pipe(
  R.split("\n"),
  R.map(
    R.pipe(
      R.split(/[-,]/),
      R.map(toInt),
    ),
  ),
)(input);

{
  console.log("part 1:", R.pipe(
    R.filter(([a, b, c, d]: number[]) => {
      return R.or(
        R.and(R.lte(a, c), R.gte(b, d)),
        R.and(R.lte(c, a), R.gte(d, b)),
      );
    }),
    R.length,
  )(data));
}

const between = (a:number, b:number, c:number) => R.and(R.lte(a, c), R.gte(b, c));

{
  console.log("part 2:", R.pipe(
    R.filter(([a, b, c, d]: number[]) => {
      return (
        between(a, b, c) ||
        between(a, b, d) ||
        between(c, d, a) ||
        between(c, d, b)
       );
    }),
    R.length,
  )(data));
}

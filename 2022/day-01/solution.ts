import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.txt").trim();

const toInt = (val: string) => parseInt(val, 10);
const sortDesc = (a: number, b: number) => b - a;

const data = R.pipe(
  R.split("\n\n"),
  R.map(
    R.pipe(
      R.split("\n"),
      R.map(toInt),
      R.sum
    )
  ),
  R.sort(sortDesc)
)(input);

{
  console.log("part 1:", R.head(data));
}

{
  console.log("part 2:", R.pipe(R.take(3), R.sum)(data));
}

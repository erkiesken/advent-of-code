import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.txt");

const toInt = (val: string) => parseInt(val, 10);

const data = R.pipe(
  R.split("\n"),
)(input);

{
  console.log("part 1:", );
}

{
  console.log("part 2:", );
}

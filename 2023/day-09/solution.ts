import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const toInt = (val: string) => parseInt(val, 10);
const tapConsole = R.tap(console.debug);

function parse(data: string): number[][] {
  return R.pipe(
    R.split("\n"),
    R.map(R.pipe(
      R.split(" "),
      R.map(toInt),
    )),
  )(data);
}

function predict(nums: number[]): number {
  const l = [R.last(nums)];

  while (true) {
    const r = [];
    // save the diffs between numbers
    for (let i = 0; i < nums.length - 1; i++) {
      r.push(nums[i+1] - nums[i]);
    }
    // remember the last digit
    l.push(R.last(r));
    nums = r;

    // done when all 0
    if (R.all(R.equals(0), r)) {
      break;
    }
  }

  let res = R.last(l);
  // prerdict based on collected last digits
  for (let i = l.length - 2; i >= 0; i--) {
    res = l[i] + res;
  }

  return res;
}

{
  const data = parse(input);

  const predictions = R.pipe(
    R.map(predict),
  )(data);

  console.log("part 1:", R.sum(predictions));
}

{
  const data = parse(input);

  const predictions = R.pipe(
    R.map(R.pipe(
      // predicting to front is the same as predicting end of reversed values
      R.reverse,
      predict,
    )),
  )(data);

  console.log("part 2:", R.sum(predictions));
}

import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const re = /\d/;
const toInt = (val: string) => parseInt(val, 10);
const isDigit = (val) => re.test(val);

{
  const data = R.pipe(
    R.split("\n"),
    R.map(
      R.pipe(
        R.split(""),
        R.filter(isDigit),
        (digits) => R.head(digits) + R.last(digits),
        toInt,
      )
    ),
  )(input);

  console.log("part 1:", R.sum(data));
}

{
  const mapping = {
    'one':   '1',
    'two':   '2',
    'three': '3',
    'four':  '4',
    'five':  '5',
    'six':   '6',
    'seven': '7',
    'eight': '8',
    'nine':  '9',
  };
  const textToDigits = (val) => {
    var r = "";
    outer:
    while (val.length) {
      for (const key of Object.keys(mapping)) {
        if (val.startsWith(key)) {
          r += mapping[key];
          val = val.slice(1);
          continue outer;
        }
      }
      r += val.slice(0, 1);
      val = val.slice(1);
    }
    return r;
  }

  const data = R.pipe(
    R.split("\n"),
    R.map(
      R.pipe(
        textToDigits,
        R.split(""),
        R.filter(isDigit),
        (digits) => R.head(digits) + R.last(digits),
        toInt,
      )
    ),
  )(input);

  console.log("part 2:", R.sum(data));
}

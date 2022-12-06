import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.txt");

const data = R.split("", input);

function findStart(input: string[], count: number) {
  const hist = [];

  let i = 0;
  for (const c of input) {
    i++;
    if (hist.length >= count) {
      hist.shift();
    }
    hist.push(c);

    if (hist.length < count) {
      continue;
    }

    if (R.length(R.uniq(hist)) == count) {
      return i;
    }
  }

  throw new Error(`Could not find ${count}-character marker`);
}

{
  const tests = [
    ["mjqjpqmgbljsphdztnvjfqwrcgsmlb", 7],
    ["bvwbjplbgvbhsrlpgdmjqwftvncz", 5],
    ["nppdvjthqldpwncqszvftbrmjlhg", 6],
    ["nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 10],
    ["zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 11],
  ];
  for (const t of tests) {
    console.log("test", t[0], t[1], findStart(String(t[0]).split(""), 4));
  }

  console.log("part 1:", findStart(data, 4));
}

{
  const tests = [
    ["mjqjpqmgbljsphdztnvjfqwrcgsmlb", 19],
    ["bvwbjplbgvbhsrlpgdmjqwftvncz", 23],
    ["nppdvjthqldpwncqszvftbrmjlhg", 23],
    ["nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 29],
    ["zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 26],
  ];
  for (const t of tests) {
    console.log("test", t[0], t[1], findStart(String(t[0]).split(""), 14));
  }

  console.log("part 2:", findStart(data, 14));
}

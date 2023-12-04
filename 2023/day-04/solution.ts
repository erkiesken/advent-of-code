import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const toInt = (val: string) => parseInt(val, 10);
const tapConsole = R.tap(console.debug);

type Card = {
  id: string,
  processed: boolean,
  winning: number[],
  numbers: number[],
  wins: number,
}

function parse(data: string): Card[] {
  return R.pipe(
    R.split("\n"),
    R.map(R.pipe(
      R.split(": "),
      ([id, rest]) => {
        const winning = R.pipe(
          R.split(" | "),
          R.head,
          R.trim,
          R.split(/ +/),
          R.map(toInt),
        )(rest);
        const numbers = R.pipe(
          R.split(" | "),
          R.last,
          R.trim,
          R.split(/ +/),
          R.map(toInt),
        )(rest);
        const wins = R.length(R.intersection(winning, numbers));
        return { id, winning, numbers, wins, processed: false } as Card;
      }
    )),
  )(data);
}

const cards = parse(input);

function winsToPoints(n: number): number {
  if (n == 0) {
    return 0;
  }
  let r = 1;
  n--;
  while (n > 0) {
    r *= 2;
    n--;
  }
  return r;
}

{
  const wins = R.map(R.pipe(
    R.prop("wins"),
    winsToPoints,
  ))(cards);

  console.log("part 1:", R.sum(wins));
}

{
  const ids = R.map(R.prop("id"), cards);
  const m = new Map();
  for (const c of cards) {
    m.set(c.id, [c]);
  }

  while (ids.length > 0) {
    const id = ids.shift();
    const cl = m.get(id);
    for (const c of cl) {
      if (c.wins > ids.length) {
        throw new Error("Can't win no more, not enough cards");
      }
      const winids = R.take(c.wins, ids);
      for (const wid of winids) {
        const wcl = m.get(wid);
        const wc = wcl[0];
        wcl.push({ id: wc.id, wins: wc.wins, processed: false });
      }
      c.processed = true;
    }
  }

  const totals = R.map(
    R.length,
    Array.from(m.values())
  );

  console.log("part 2:", R.sum(totals));
}

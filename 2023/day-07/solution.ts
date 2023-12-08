import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const toInt = (val: string) => parseInt(val, 10);
const tapConsole = R.tap(console.debug);

const strength1 = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "T": 10,
  "J": 11,
  "Q": 12,
  "K": 13,
  "A": 14,
};
const strength2 = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "T": 10,
  "J": 1,  // J is weak
  "Q": 12,
  "K": 13,
  "A": 14,
};

function cardStrength1(card: string): number {
  return strength1[card];
}

function cardCompare1(a, b: string): number {
  const as = cardStrength1(a);
  const bs = cardStrength1(b);
  if (as < bs) {
    return -1;
  } else if (as > bs) {
    return 1;
  }
  return 0;
}

function cardStrength2(card: string): number {
  return strength2[card];
}

function cardCompare2(a, b: string): number {
  const as = cardStrength2(a);
  const bs = cardStrength2(b);
  if (as < bs) {
    return -1;
  } else if (as > bs) {
    return 1;
  }
  return 0;
}

type Hand = {
  hand: string,
  cards: string[],
  bid: number,
  jokers: number,
  counts: number[],
  rank: number,
}

function compareHands(h1: Hand, h2: Hand, compare): number {
  // If smaller amount of counts means better hand
  if (h1.counts.length > h2.counts.length) {
    return -1;
  } else if (h1.counts.length < h2.counts.length) {
    return 1;
  }
  // Compare count by count, triples win doubles etc
  for (let i of R.range(0, h1.counts.length)) {
    const h1c = h1.counts[i];
    const h2c = h2.counts[i];
    if (h1c < h2c) {
      return -1;
    } else if (h1c > h2c) {
      return 1;
    }
  }
  // Compare card by card
  for (let i of R.range(0, h1.cards.length)) {
    const h1c = h1.cards[i];
    const h2c = h2.cards[i];
    const c = compare(h1c, h2c);
    if (c < 0) {
      return -1;
    } else if (c > 0) {
      return 1;
    }
  }
  // Seem equal hands
  return 0;
}

function compareHands1(h1: Hand, h2: Hand): number {
  return compareHands(h1, h2, cardCompare1);
}

function compareHands2(h1: Hand, h2: Hand): number {
  return compareHands(h1, h2, cardCompare2);
}

function parse(data: string, joker: string = "X"): Hand[] {
  return R.pipe(
    R.split("\n"),
    R.map(R.pipe(
      R.trim,
      R.split(" "),
      ([hand, bid]) => ({
          hand,
          cards: R.split("", hand),
          bid: toInt(bid),
      }),
      (game) => ({
        ...game,
        rank: 0,
        // extract joker count
        jokers: R.pipe(
          R.countBy(R.identity),
          R.propOr(0, joker),
        )(game.cards),
        // count by card, sort and keep counts only in decreasing order
        counts: R.pipe(
          R.countBy(R.identity),
          R.values,
          (a) => a.sort(),
          R.reverse,
        )(game.cards),
      })
    )),
  )(data);
}

function addRank(hands: Hand[]): Hand[] {
  hands.forEach((item, idx) => item.rank = idx + 1);
  return hands;
}

{
  const hands = parse(input);

  const scores = R.pipe(
    R.sort(compareHands1),
    addRank,
    R.map(({ rank, bid }) => rank * bid),
  )(hands);

  console.log("part 1:", R.sum(scores));
}

{
  const scores = R.pipe(
    R.map(
      (game) => ({
        ...game,
        // Remove jokers from cards and recalculate counts
        counts: R.pipe(
          R.reject(R.equals("J")),
          R.countBy(R.identity),
          R.values,
          (a) => a.sort(),
          R.reverse,
          (counts) => {
            // If joker is in play it increases best combo (four/three of kind, pairs etc)
            if (game.jokers > 0) {
              counts[0] += game.jokers;
            }
            return counts;
          },
        )(game.cards),
      })
    ),
    R.sort(compareHands2),
    addRank,
    R.map(({ rank, bid }) => rank * bid),
  )(parse(input, "J"));

  console.log("part 2:", R.sum(scores));
}

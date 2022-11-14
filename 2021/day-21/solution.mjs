import { readFileSync } from 'fs';
import { pipe, clone, curry, __, split, map, tail, take, join, last } from 'ramda';

const toInt = curry(parseInt)(__, 10);

const input = readFileSync('input.txt', { encoding: 'utf-8' }).trim();

const data = pipe(
  split('\n'),
  map(pipe(
    (s) => /Player (\d) starting position: (\d+)/.exec(s),
    tail,
    take(2),
    map(toInt),
    last,
  )),
)(input);

class DetDice {
  constructor(sides) {
    this.sides = sides;
    this.rolls = 0;
    this.last = 0;
  }

  roll() {
    const roll = ++this.last;
    this.rolls++;
    // loop over to 1
    this.last = this.last % this.sides;
    return roll;
  }
}

{
  let result = null;

  const dice = new DetDice(100);
  const pos = clone(data);
  const scores = [0, 0];
  let turn = 0;

  while (true) {
    const s = pos[turn];
    const r = dice.roll() + dice.roll() + dice.roll();
    const p = (s + r - 1) % 10 + 1;

    pos[turn] = p;
    scores[turn] = scores[turn] + p;

    if (scores[0] >= 1000 || scores[1] >= 1000) {
      break;
    }

    turn = ++turn % 2;
  }

  result = dice.rolls * Math.min(scores[0], scores[1]);

  console.log('part 1:', result);
}

{
  let result = null;

  const winsAt = 21;
  const rolls = [1, 2, 3];
  const memo = new Map();
  const freqs = new Map();
  for (let i of rolls) {
    for (let j of rolls) {
      for (let k of rolls) {
        let s = i + j + k;
        freqs.set(s, (freqs.get(s) ?? 0) + 1);
      }
    }
  }

  function countWins(ascore, bscore, apos, bpos, aturn) {
    let key = join(':', [ascore, bscore, apos, bpos, aturn]);
    if (memo.has(key)) {
      return memo.get(key);
    }
    if (ascore >= winsAt) {
      memo.set(key, [1, 0]);
      return memo.get(key);
    }
    if (bscore >= winsAt) {
      memo.set(key, [0, 1]);
      return memo.get(key);
    }
    let total = [0, 0];
    for (let diceSum of freqs.keys()) {
      let wins;
      let pos;
      if (aturn) {
        pos = (apos - 1 + diceSum) % 10 + 1;
        wins = countWins(ascore + pos, bscore, pos, bpos, !aturn);
      } else {
        pos = (bpos - 1 + diceSum) % 10 + 1;
        wins = countWins(ascore, bscore + pos, apos, pos, !aturn);
      }
      total = [
        total[0] + freqs.get(diceSum) * wins[0],
        total[1] + freqs.get(diceSum) * wins[1],
      ];
    }
    memo.set(key, total);
    return total;
  }

  result = Math.max(...countWins(0, 0, data[0], data[1], true));

  console.log('part 2:', result);
}

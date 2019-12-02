const fs = require('fs');
const path = require('path');
const treis = require('treis');
const { compose, map, reject, isEmpty, trim, split, match, sort, range, concat, countBy, identity, toPairs, head, last } = require('ramda');

const input = fs.readFileSync(path.resolve('./input.txt'), 'utf-8');

const lines = compose(
  sort((a, b) => a.localeCompare(b)),
  reject(isEmpty),
  map(trim),
  split('\n')
)(input);

const guardStats = new Map();

let guard;
let sleeping = false;
let sleepStart;
for (let log of lines) {
  const minute = parseInt(match(/^\[\d+-\d+-\d+ \d+:(\d+)\] /, log)[1], 10);
  if (log.includes('begins shift')) {
    let id = parseInt(match(/Guard #(\d+)/, log)[1], 10);
    if (!guardStats.has(id)) {
      guardStats.set(id, { id, sleepMinutes: [] });
    }
    guard = guardStats.get(id);
    sleeping = false;
    sleepStart = undefined;
  } else if (log.includes('falls asleep')) {
    sleeping = true;
    sleepStart = minute;
  } else if (log.includes('wakes up')) {
    guard.sleepMinutes = concat(guard.sleepMinutes, range(sleepStart, minute));
    sleeping = false;
    sleepStart = undefined;
  }
}

for (let guard of guardStats.values()) {
  guard.sleepTotal = guard.sleepMinutes.length;
  guard.sleepStats = compose(
    sort((a, b) => b[1] - a[1]),
    toPairs,
    countBy(identity)
  )(guard.sleepMinutes);
  guard.sleepMaxMinute = (guard.sleepStats.length && parseInt(head(head(guard.sleepStats)), 10)) || -1;
}

{
  const guard = compose(
    head,
    sort((a, b) => b.sleepTotal - a.sleepTotal)
  )(Array.from(guardStats.values()));

  console.log(
    `part 1 - guard ID (${guard.id}) * sleepiest minute (${guard.sleepMaxMinute}):`,
    guard.id * guard.sleepMaxMinute
  );
}

{
  const guard = compose(
    head,
    sort((a, b) => b.sleepMaxMinute - a.sleepMaxMinute)
  )(Array.from(guardStats.values()));

  console.log(
    `part 2 - guard ID (${guard.id}) * sleepiest minute (${guard.sleepMaxMinute}):`,
    guard.id * guard.sleepMaxMinute
  );
}

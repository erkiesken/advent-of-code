import { readFileSync } from 'fs';

const input = readFileSync('input.txt').toString();

const data = input
      .split('\n')
      .map((item) => item.split(" "))
      .map(([action, value]) => [action, parseInt(value, 10)]);

{
  let depth = 0;
  let pos = 0;

  for (let item of data) {
    const [action, value] = item;
    if (action == 'forward') {
      pos += value;
    } else if (action == 'down') {
      depth += value;
    } else if (action == 'up') {
      depth -= value;
    }
  }
  const result = depth * pos;

  console.log('part 1:', result);
}

{
  let depth = 0;
  let pos = 0;
  let aim = 0;

  for (let item of data) {
    const [action, value] = item;
    if (action == 'forward') {
      pos += value;
      depth += aim * value;
    } else if (action == 'down') {
      aim += value;
    } else if (action == 'up') {
      aim -= value;
    }
  }
  const result = depth * pos;

  console.log('part 2:', result);
}

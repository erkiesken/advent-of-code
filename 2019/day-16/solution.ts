import { readFileSync} from 'fs';

function parse(s: string) {
  return s.trim().split('').map((val) => parseInt(val, 10));
}

const input = parse(readFileSync('input.txt', { encoding: 'utf-8' }));


function * genpattern(times: number): Generator<number> {
  const base = [0, 1, 0, -1];
  let rep = 1;
  let at = 0;
  while (true) {
    if (rep >= times) {
      at = (at + 1) % base.length;
      rep = 0;
    }
    rep += 1;
    yield base[at];
  }
}

async function part1(input: number[], phases: number = 100) {
  let iter = 0;
  let result = [...input];

  while (++iter <= phases) {
    console.log(`iter ${iter}`);
    const tmp = [];
    for (let i = 0; i < result.length; i += 1) {
      const pattern = genpattern(i + 1);
      let val = 0;
      for (let j = 0; j < result.length; j += 1) {
        val += result[j] * (await pattern.next()).value;
      }
      tmp.push(Math.abs(val) % 10);
    }
    result = tmp;
  }

  return result;
}

function printResult(res: number[]) {
  console.log(res.slice(0, 8).join(''));
}


async function main() {
  {
    const data = parse('80871224585914546619083218645595');
    const res = await part1(data, 100);
    printResult(res);
  }
  {
    const data = parse('19617804207202209144916044189917');
    const res = await part1(data, 100);
    printResult(res);
  }
  {
    const data = parse('69317163492948606335995924319873');
    const res = await part1(data, 100);
    printResult(res);
  }
  {
    const res = await part1(input, 100);
    printResult(res);
  }

  {
    const data = parse('69317163492948606335995924319873'.repeat(10_000));
    const res = await part1(data, 100);
    printResult(res);
  }
}

main();

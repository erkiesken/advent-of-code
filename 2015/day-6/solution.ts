import { readFileStrSync } from 'https://deno.land/std@v0.25.0/fs/read_file_str.ts';

const re = /(toggle|turn off|turn on) (\d+),(\d+) through (\d+),(\d+)/;

function int(s: string) {
  return parseInt(s, 10);
}

const data = readFileStrSync('input.txt')
  .trim()
  .split('\n')
  .map((line) => re.exec(line))
  .map((match) => ({ mode: match[1], x1: int(match[2]), y1: int(match[3]), x2: int(match[4]), y2: int(match[5]) }));



{
  const w = 1_000;
  const h = 1_000;
  const lights = (new Array(w * h)).fill(0);

  for (let item of data) {
    for (let x = item.x1; x <= item.x2; x++) {
      for (let y = item.y1; y <= item.y2; y++) {
        const l = // TODO

      }
    }
  }
}

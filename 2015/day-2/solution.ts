import { readFileStrSync } from 'https://deno.land/std@v0.25.0/fs/read_file_str.ts';

type Data = number[][];

const data:Data = readFileStrSync('input.txt')
  .trim()
  .split('\n')
  .map((line) => line.split('x').map((val) => parseInt(val, 10)));

function paperNeeded(w, h, l) {
  const s1 = w*h;
  const s2 = w*l;
  const s3 = h*l;
  const extra = Math.min(s1, s2, s3);

  return 2*s1 + 2*s2 + 2*s3 + extra;
}

function ribbonNeeded(w, h, l) {
  return Math.min(
    2*w + 2*h,
    2*w + 2*l,
    2*h + 2*l,
  ) + w * h * l;
}

{
  const total = data.reduce((acc, val) => {
    return acc + paperNeeded(val[0], val[1], val[2]);
  }, 0);

  console.log(`Total wrapping paper needed: ${total}`);
}

{
  const total = data.reduce((acc, val) => {
    return acc + ribbonNeeded(val[0], val[1], val[2]);
  }, 0);

  console.log(`Total ribbon needed: ${total}`);
}

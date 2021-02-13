import { readFileStrSync } from 'https://deno.land/std@v0.25.0/fs/read_file_str.ts';

const data = readFileStrSync('input.txt')
  .trim()
  .split('')
  .map((val) => parseInt(val, 10));

const w = 25;
const h = 6;
const s = w * h;

const layers = [];

for (let i = 0; i < data.length; i += s) {
  layers.push(data.slice(i, i + s));
}

function countDigits(input, digit) {
  return input.filter((val) => val === digit).length;
}

{
  let most = Infinity;
  let zeroes;
  for (let layer of layers) {
    const c = countDigits(layer, 0);
    if (c < most) {
      zeroes = layer;
      most = c;
    }
  }
  const result = countDigits(zeroes, 1) * countDigits(zeroes, 2);
  console.log(`Checksum is: ${result}`);
}

{
  const result = (new Array(s)).fill(2);
  let c;
  for (let layer of layers) {
    for (let i=0; i < layer.length; i += 1) {
      c = layer[i];
      if ((c === 0 || c === 1) && result[i] === 2) {
        result[i] = c;
      }
    }
  }
  console.log('Password:');
  for (let i = 0; i < result.length; i += w) {
    console.log(
      result
        .slice(i, i + w)
        .join('')
        .replace(/0/g, '\u001b[40m ') // black
        .replace(/1/g, '\u001b[47m ') // white
    );
  }
}

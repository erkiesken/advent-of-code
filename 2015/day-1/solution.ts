import { readFileStrSync } from 'https://deno.land/std@v0.25.0/fs/read_file_str.ts';

const data = readFileStrSync('input.txt').trim().split('');

{
  let floor = 0;
  for (let v of data) {
    floor += (v === '(') ? 1 : -1;
  }
  console.log(`Santa is on floor: ${floor}`);
}

{
  let floor = 0;
  let step = 0;
  for (let v of data) {
    step += 1;
    floor += (v === '(') ? 1 : -1;
    if (floor < 0) {
      break;
    }
  }
  console.log(`Santa entered basement on step: ${step}`);
}

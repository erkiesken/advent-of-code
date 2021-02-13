import { readFileStrSync } from 'https://deno.land/std@v0.25.0/fs/read_file_str.ts';

type Data = string[];

const data:Data = readFileStrSync('input.txt').trim().split('');


{
  let x = 0;
  let y = 0;
  let xy = `${x}:${y}`;
  const visited = new Map();
  visited.set(xy, 1);
  for (let step of data) {
    if (step === '>') {
      x += 1;
    } else if (step === '<') {
      x -= 1;
    } else if (step === '^') {
      y -= 1;
    } else if (step === 'v') {
      y += 1;
    }
    xy = `${x}:${y}`;
    visited.set(xy, (visited.get(xy) || 0) + 1);
  }

  console.log(`Santa visited houses total: ${visited.size}`);
}

{
  type Pos = {x: number, y: number};
  const santa: Pos = { x: 0, y: 0};
  const roboSanta: Pos = { x: 0, y: 0 };
  const visited = new Map();
  let xy = '0:0';
  visited.set(xy, 2);

  let idx = 0;
  for (let step of data) {
    let dx = 0;
    let dy = 0;
    if (step === '>') {
      dx = 1;
    } else if (step === '<') {
      dx = -1;
    } else if (step === '^') {
      dy = -1;
    } else if (step === 'v') {
      dy = 1;
    }
    if ((idx % 2) === 0) {
      santa.x += dx;
      santa.y += dy;
      xy = `${santa.x}:${santa.y}`;
    } else {
      roboSanta.x += dx;
      roboSanta.y += dy;
      xy = `${roboSanta.x}:${roboSanta.y}`;
    }
    visited.set(xy, (visited.get(xy) || 0) + 1);
    idx += 1;
  }

  console.log(`Santa and RoboSanta visited houses total: ${visited.size}`);
}

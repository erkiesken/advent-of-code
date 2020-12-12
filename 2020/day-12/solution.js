const fs = require('fs');
const path = require('path');
const { compose, pipe, map, reject, isEmpty, trim, split, join, flatten, countBy, identity, prop, range } = require('ramda');

const input = fs.readFileSync(path.resolve('./input.txt'), 'utf-8');

const data = pipe(
  split('\n'),
  map(trim),
  reject(isEmpty),
  map((s) => {
    const m = /(?<cmd>\w)(?<val>\d+)/.exec(s);
    return [m.groups.cmd, parseInt(m.groups.val, 10), m[0]];
  }),
)(input);


const dirs = {
  N: {
    'R90': 'E',
    'L90': 'W',
    'R180': 'S',
    'L180': 'S',
    'R270': 'W',
    'L270': 'E',
  },
  S: {
    'R90': 'W',
    'L90': 'E',
    'R180': 'N',
    'L180': 'N',
    'R270': 'E',
    'L270': 'W',
  },
  E: {
    'R90': 'S',
    'L90': 'N',
    'R180': 'W',
    'L180': 'W',
    'R270': 'N',
    'L270': 'S',
  },
  W: {
    'R90': 'N',
    'L90': 'S',
    'R180': 'E',
    'L180': 'E',
    'R270': 'S',
    'L270': 'N',
  },
};

function advance1(dir, cmd, val, x, y) {
  if (cmd === 'F' && dir === 'N') {
    return [x, y - val];
  } else if (cmd === 'F' && dir === 'S') {
    return [x, y + val];
  } else if (cmd === 'F' && dir === 'W') {
    return [x - val, y];
  } else if (cmd === 'F' && dir === 'E') {
    return [x + val, y];
  } else if (cmd === 'N') {
    return [x, y - val];
  } else if (cmd === 'S') {
    return [x, y + val];
  } else if (cmd === 'W') {
    return [x - val, y];
  } else if (cmd === 'E') {
    return [x + val, y];
  }
  throw new Error('Invalid advance', dir, cmd, val);
}

function solve1(data) {
  let dir = 'E';
  let x = 0;
  let y = 0;

  for (let [cmd, val, full] of data) {
    // console.log(cmd, val, full, dir);

    if (cmd === 'R' || cmd === 'L') {
      dir = dirs[dir][full];
      continue;
    }

    [x, y] = advance1(dir, cmd, val, x, y);
  }

  console.log('Position:', x, y);

  return Math.abs(x) + Math.abs(y);
}

function advance1(dir, cmd, val, x, y, dx, dy) {
  if (cmd === 'F' && dir === 'N') {
    return [x, y - val];
  } else if (cmd === 'F' && dir === 'S') {
    return [x, y + val];
  } else if (cmd === 'F' && dir === 'W') {
    return [x - val, y];
  } else if (cmd === 'F' && dir === 'E') {
    return [x + val, y];
  } else if (cmd === 'N') {
    return [x, y - val];
  } else if (cmd === 'S') {
    return [x, y + val];
  } else if (cmd === 'W') {
    return [x - val, y];
  } else if (cmd === 'E') {
    return [x + val, y];
  }
  throw new Error('Invalid advance', dir, cmd, val);
}


function advance2(cmd, val, x, y, dx, dy) {
  if (cmd !== 'F') {
    throw new Error('Invalid advance', cmd, val);
  }
  return [
    x + val * dx,
    y + val * dy,
  ];
}

function rotate2(x, y, degrees) {
  const rad = (degrees / 90) * (Math.PI / 2);
  return [
    Math.round(x * Math.cos(rad) - y * Math.sin(rad)),
    Math.round(x * Math.sin(rad) + y * Math.cos(rad)),
  ];
}

function solve2(data) {
  let dx = 10;
  let dy = 1;
  let x = 0;
  let y = 0;

  for (let [cmd, val, full] of data) {
    if (cmd === 'L') {
      [dx, dy] = rotate2(dx, dy, val);
    } else if (cmd === 'R') {
      [dx, dy] = rotate2(dx, dy, -val);
    } else if (cmd === 'W') {
      dx -= val;
    } else if (cmd === 'E') {
      dx += val;
    } else if (cmd === 'N') {
      dy += val;
    } else if (cmd === 'S') {
      dy -= val;
    } else if (cmd === 'F') {
      [x, y] = advance2(cmd, val, x, y, dx, dy);
    } else {
      throw new Error('Unhandled command:', full);
    }
  }

  console.log('Position:', x, y);

  return Math.abs(x) + Math.abs(y);
}

{
  const result = solve1(data);
  console.log('Step 1 result:', result);
}

{
  const result = solve2(data);
  console.log('Step 2 result:', result);
}

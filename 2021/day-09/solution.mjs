import { readFileSync } from 'fs';
import { clone, pipe, sum, inc, split, map, reduce, multiply, takeLast, curry, __ } from 'ramda';

const input = readFileSync('input.txt', { encoding: 'utf-8' }).trim();

const toInt = curry(parseInt)(__, 10);

const data = pipe(
  split('\n'),
  map(split('')),
  map(map(toInt)),
)(input);

const lp = [];

{
  let result = null;

  const d = map(map(inc))(clone(data));

  const lows = [];

  const rows = d.length;
  const cols = d[0].length;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const v = d[i][j];
      const t = d[i-1] && d[i-1][j] || Infinity;
      const l = d[i][j-1] || Infinity;
      const r = d[i][j+1] || Infinity;
      const b = d[i+1] && d[i+1][j] || Infinity;
      if (v < t && v < b && v < l && v < r) {
        lows.push(v);
        lp.push([i, j]);
      }
    }
  }

  result = sum(lows);

  console.log('part 1:', result);
}

{
  const d = clone(data);

  function fill(d, s, x, y) {
    const key = `${x}:${y}`;
    if (d[x] == undefined || d[x][y] == undefined || d[x][y] == 9 || s.has(key)) {
      return 0;
    }
    s.set(key, true);
    return (1
      + fill(d, s, x - 1, y)
      + fill(d, s, x + 1, y)
      + fill(d, s, x, y - 1)
      + fill(d, s, x, y + 1)
    );
  }

  const sizes = [];
  for (const low of lp) {
    sizes.push(fill(d, new Map(), low[0], low[1]));
  }

  sizes.sort(function(a, b){return a-b});

  console.log('part 2:', reduce(multiply, 1, takeLast(3, sizes)));
}

import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const toInt = (val: string) => parseInt(val, 10);
const tapConsole = R.tap(console.debug);

function parse(data: string, mode=1) {
  const dirmap = {
    "0": "R",
    "1": "D",
    "2": "L",
    "3": "U",
  };
  return R.pipe(
    R.split("\n"),
    R.map(R.pipe(
      R.split(" "),
      ([dir, val, hex]) => {
        if (mode == 2) {
          return [
            dirmap[hex.slice(7,8)],
            parseInt(hex.slice(2,7), 16),
            "#",
          ];
        }
        return [dir, toInt(val), "#"];
      },
    )),
  )(data);
}

function dig(steps) {
  const m = new Map();
  let x = 0;
  let y = 0;
  m.set(`${x}:${y}`, null);
  for (const [dir, val, hex] of steps) {
    let d = [];
    if (dir == "U") {
      d = R.map(R.always([0, -1]), R.range(0, val));
    } else if (dir == "D") {
      d = R.map(R.always([0, 1]), R.range(0, val));
    } else if (dir == "L") {
      d = R.map(R.always([-1, 0]), R.range(0, val));
    } else if (dir == "R") {
      d = R.map(R.always([1, 0]), R.range(0, val));
    }
    for (const [dx, dy] of d) {
      x += dx;
      y += dy;
      m.set(`${x}:${y}`, [x, y, hex]);
    }
  }
  return m;
}

function bounds(m: Map) {
  const vals = Array.from(m.values());
  const xs = R.map(R.prop(0), vals);
  const ys = R.map(R.prop(1), vals);
  return {
    minx: R.reduce(R.min, Infinity, xs),
    maxx: R.reduce(R.max, -Infinity, xs),
    miny: R.reduce(R.min, Infinity, ys),
    maxy: R.reduce(R.max, -Infinity, ys),
  };
}

function isOdd(n: number) {
  return n % 2 == 1;
}

function intersects(x, y, b, p) {
  let left = 0;
  let right = 0;
  let up = 0;
  let down = 0;

  for (let yy = b.miny; yy < y; yy++) {
    up += p.has(`${x}:${yy}`) ? 1 : 0;
  }
  for (let yy = y+1; yy <= b.maxy; yy++) {
    down += p.has(`${x}:${yy}`) ? 1 : 0;
  }
  for (let xx = b.minx; xx < x; xx++) {
    left += p.has(`${xx}:${y}`) ? 1 : 0;
  }
  for (let xx = x + 1; xx <= b.maxx; xx++) {
    right += p.has(`${xx}:${y}`) ? 1 : 0;
  }
  return {
    left,
    right,
    up,
    down,
    inside: isOdd(left) && isOdd(right) && isOdd(up) && isOdd(down),
  };
}

function flood(m: Map) {
  const b = bounds(m);
  const minx = b.minx - 1;
  const miny = b.miny - 1;
  const maxx = b.maxx + 2;
  const maxy = b.maxy + 2;
  let id = "";
  const todo = [[minx, miny]];
  while (todo.length) {
    const [x, y] = todo.shift();
    id = `${x}:${y}`;
    if (m.has(id) || (y < miny) || (y > maxy) || (x < minx) || (x > maxx)) {
      continue;
    }
    m.set(id, [x, y, "x"]);
    todo.push([x - 1, y]);
    todo.push([x + 1, y]);
    todo.push([x, y - 1]);
    todo.push([x, y + 1]);
  }
  return m;
}

function fill(m: Map) {
  const p = new Set(m.keys());
  const b = bounds(m);

  for (let y = b.miny; y <= b.maxy; y++) {
    for (let x = b.minx; x <= b.maxx; x++) {
      const id = `${x}:${y}`;
      // console.log(id);
      if (p.has(id)) {
        // console.log("already there");
        continue;
      }
      const ix = intersects(x, y, b, p);
      // console.log(ix);
      if (ix.inside) {
        // console.log("adding", x, y);
        m.set(id, [x, y, null]);
      }
    }
  }
  return m;
}

function print(m: Map) {
  const b = bounds(m);
  const r = [];
  for (let y = b.miny; y <= b.maxy; y++) {
    for (let x = b.minx; x <= b.maxx; x++) {
      const id = `${x}:${y}`
      r.push(m.has(id) ? m.get(id)[2] : ".");
    }
    r.push("\n");
  }
  console.log(r.join(""));
}

function getsize(m: Map) {
  const b = bounds(m);
  const xs = R.pipe(
    R.map(R.prop(2)),
    R.filter(R.equals("x")),
    R.length,
  )(Array.from(m.values()));
  const w = b.maxx - b.minx + 1;
  const h = b.maxy - b.miny + 1;
  return w * h - xs;
}


{
  const data = parse(input);
  const map = dig(data);

  print(map);
  flood(map);
  print(map);

  const size = getsize(map);

  console.log("part 1:", size);
}

{
  const data = parse(input, 2);
  const map = dig(data);
  console.log("map size", map.size);
  flood(map);
  const size = getsize(map);

  console.log("part 2:", );
}

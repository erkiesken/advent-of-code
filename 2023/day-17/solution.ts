import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const dataFile = Deno.args[0] || "input.txt";

console.log("Using data file:", dataFile);

const input = Deno.readTextFileSync(dataFile).trim();

const toInt = (val: string) => parseInt(val, 10);
const tapConsole = R.tap(console.debug);

function parse(data: string) {
  const grid = R.pipe(
    R.split("\n"),
    R.map(R.pipe(
      R.split(""),
      R.map(toInt),
    )),
  )(data);
  const rows = grid.length;
  const cols = grid[0].length;
  for (let r=0; r < rows; r++) {
    for (let c=0; c < cols; c++) {
      grid[r][c] = { cost: grid[r][c], row: r, col: c, id: `${r}:${c}` };
    }
  }
  for (let r=0; r < rows; r++) {
    for (let c=0; c < cols; c++) {
      const g = grid[r][c];
      if (r > 0) {
        g.up = grid[r-1][c];
      }
      if (r < rows - 1) {
        g.down = grid[r+1][c];
      }
      if (c > 0) {
        g.left = grid[r][c-1];
      }
      if (c < cols - 1) {
        g.right = grid[r][c+1];
      }
    }
  }
  return {
    start: grid[0][0],
    end: grid[rows-1][cols-1],
  };
}

function walkdeep(start, end) {
  let best = Infinity;

  const nodeBest = new Map();

  const p = {
    node: start,
    cost: 0,
    hist: new Set([start.id]),
    turns: [],
  };
  let i=0;
  let pruned = 0;

  function visit(p) {
    if (i++ % 100_000 == 0) {
      console.log(i, pruned, best, p.hist.size, p.turns.length);
    }
    if (p.node === end) {
      console.log("found end", p.cost, p.turns);
      best = Math.min(best, p.cost);
      return;
    }
    if (nodeBest.has(p.node.id)) {
      if (p.cost > nodeBest.get(p.node.id)) {
        return;
      }
      nodeBest.set(p.node.id, p.cost);
    }
    const dirs = directions(p);
    // console.log(i, p.node.id, dirs);
    for (const dir of dirs) {
      const node = p.node[dir];
      const cost = p.cost + node.cost;
      if (cost > best) {
        pruned++;
        // console.log("too expensive", node.id, cost);
        continue;
      }
      if (p.hist.has(node.id)) {
        pruned++;
        // console.log("already visited", node.id);
        continue;
      }
      const np = {
        node,
        cost,
        hist: new Set([...p.hist.values(), node.id]),
        turns: [...R.takeLast(2, p.turns), dir],
      };
      visit(np);
    }
  }

  visit(p);

  return best;
}


function walkwide(start, end) {
  let best = Infinity;
  const nodeBest = new Map();
  const sp = {
    node: start,
    cost: 0,
    // path: [start.id],
    turns: [],
  };
  let q = [sp];

  while (q.length > 0) {
    const nq = [];
    for (const p of q) {
      if (p.node === end) {
        console.log("found end", p.cost, q.length);
        best = Math.min(best, p.cost);
        continue;
      }
      const dirs = directions(p);
      for (const dir of dirs) {
        const node = p.node[dir];
        const cost = p.cost + node.cost;
        if (cost > best) {
          continue;
        }
        if (!nodeBest.has(node.id)) {
          nodeBest.set(node.id, cost);
        }
        if (nodeBest.get(node.id) < cost) {
          continue;
        }
        // if (R.find(R.equals(node.id), p.path)) {
        //   continue;
        // }
        nq.push({
          node,
          cost,
          // path: [...p.path, node.id],
          turns: [...R.takeLast(2, p.turns), dir],
        });
      }
    }
    q = nq;
  }
  return best;
}

const sortByFirstItem = R.sortBy(R.prop(0));

function directions(p) {
  const d = [];
  const last = R.last(p.turns);
  const last3 = p.turns.join("-");
  if (p.node.down && last != "up" && last3 != "down-down-down") {
    d.push([p.node.down.cost, "down"]);
  }
  if (p.node.right && last != "left" && last3 != "right-right-right") {
    d.push([p.node.right.cost, "right"]);
  }
  if (p.node.up && last != "down" && last3 != "up-up-up") {
    d.push([10+p.node.up.cost, "up"]);
  }
  if (p.node.left && last != "right" && last3 != "left-left-left") {
    d.push([10+p.node.left.cost, "left"]);
  }
  return R.pipe(
    sortByFirstItem,
    R.map(R.last),
  )(d);
}

{
  const { start, end  } = parse(input);

  const best = walkwide(start, end);

  console.log("part 1:", best);
}

{
  console.log("part 2:", );
}

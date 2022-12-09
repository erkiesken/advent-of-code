import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.txt");

const toInt = (val: string) => parseInt(val, 10);

type Row = [string, number];
type Pos = { x: number, y: number, isTail?: boolean };

const data:Row[] = R.pipe(
  R.split("\n"),
  R.map(R.pipe(R.split(" "), (r: string[]) => [r[0], toInt(r[1])])),
)(input);

function follow(h: Pos, t:Pos, v:Set<string>): void {
  const dx = Math.abs(h.x - t.x);
  const dy = Math.abs(h.y - t.y);

  if (dx == 0 && dy == 0) {
    // do nothing, overlapping
  } else if (dx <= 1 && dy <= 1) {
    // do nothing, closeby
  } else if ((dx + dy) > 2) {
    // wide gap, move both
    t.x += Math.sign(h.x - t.x);
    t.y += Math.sign(h.y - t.y);
  } else if (dx > 1) {
    t.x += Math.sign(h.x - t.x);
  } else if (dy > 1) {
    t.y += Math.sign(h.y - t.y);
  }

  if (t.isTail) {
    const p = `${t.x}:${t.y}`;
    v.add(p);
  }
}

function move(h:Pos, t:Pos, v:Set<string>, dx: number, dy: number): void {
  const sx = Math.sign(dx);
  const sy = Math.sign(dy);

  dx = Math.abs(dx);
  dy = Math.abs(dy);

  while (dx > 0) {
    h.x += sx;
    follow(h, t, v);
    dx--;
  }
  while (dy > 0) {
    h.y += sy;
    follow(h, t, v);
    dy--;
  }
}

function moveRope(rope: Pos[], v:Set<string>, dx: number, dy: number): void {
  const sx = Math.sign(dx);
  const sy = Math.sign(dy);

  dx = Math.abs(dx);
  dy = Math.abs(dy);
  const h = rope[0];

  while (dx > 0) {
    h.x += sx;
    for (let i = 0; i < (rope.length - 1); i++) {
      follow(rope[i], rope[i+1], v);
    }
    dx--;
  }
  while (dy > 0) {
    h.y += sy;
    for (let i = 0; i < (rope.length - 1); i++) {
      follow(rope[i], rope[i+1], v);
    }
    dy--;
  }
}

{
  const visited = new Set<string>();
  const head:Pos = { x: 0, y: 0 };
  const tail:Pos = { x: 0, y: 0, isTail: true };

  for (const [dir, count] of data) {
    if (dir === "U") {
      move(head, tail, visited, 0, count);
    } else if (dir === "D") {
      move(head, tail, visited, 0, -count);
    } else if (dir === "L") {
      move(head, tail, visited, -count, 0);
    } else if (dir === "R") {
      move(head, tail, visited, count, 0);
    }
  }

  console.log("part 1:", visited.size);
}

{
  const visited = new Set<string>();
  const rope:Pos[] = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0, isTail: true },
  ];

  for (const [dir, count] of data) {
    if (dir === "U") {
      moveRope(rope, visited, 0, count);
    } else if (dir === "D") {
      moveRope(rope, visited, 0, -count);
    } else if (dir === "L") {
      moveRope(rope, visited, -count, 0);
    } else if (dir === "R") {
      moveRope(rope, visited, count, 0);
    }
  }

  console.log("part 2:", visited.size);
}

import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";
import { range } from "https://deno.land/x/denum@v1.2.0/mod.ts";

const input = Deno.readTextFileSync("input.test.txt").trim();

const data: string[] = R.pipe(
  R.split(""),
)(input);

type Offset = [number, number];

type Cave = Map<number, string[]>

type Heights = number[];

type Rock = {
  x: number,
  y: number,
  w: number,
  fill: Offset[],
}

function makeRock(type: number, x: number, y:number): Rock {
  switch (type) {
      case 0:
         return { x, y, w: 4, fill: [[0,0],[1,0],[2,0],[3,0]] };
      case 1:
         return { x, y, w: 3, fill: [[1,0],[0,1],[1,1],[2,1],[1,2]] };
      case 2:
         return { x, y, w: 3, fill: [[0,0],[1,0],[2,0],[2,1],[2,2]] };
      case 3:
         return { x, y, w: 1, fill: [[0,0],[0,1],[0,2],[0,3]] };
      case 4:
         return { x, y, w: 2, fill: [[0,0],[0,1],[1,0],[1,1]] };
      default:
        throw new Error("Unknown rock");
  }
}

class Moves {
  private i = -1;
  private l = 0;
  constructor(public moves: string[]) {
    this.l = this.moves.length;
  }

  next() {
    return this.moves[++this.i % this.l];
  }

  getIndex() {
    return this.i % this.l;
  }
}

function rockWillRest(rock: Rock, cave: Cave) {
  if (rock.y < 0) {
    return true;
  }

  for (const f of rock.fill) {
    const x = rock.x + f[0];
    const y = rock.y + f[1];
    const c = cave.get(y);
    if (c !== undefined && c[x] !== undefined) {
      return true;
    }
  }
  return false;
}

function fillWithRock(rock: Rock, cave: Cave) {
  for (const f of rock.fill) {
    const x = rock.x + f[0];
    const y = rock.y + f[1];
    const c = cave.has(y) ? cave.get(y)! : [];
    if (!cave.has(y)) {
      cave.set(y, c);
    }
    c[x] = "#";
  }
  return cave;
}


function printCave(cave: Cave) {
  const maxy = Math.max(...cave.keys());
  const miny = Math.min(...cave.keys());

  for (let y = maxy; y >= miny; y--) {
    const a: string[] = [];
    for (let x = 0; x < 7; x++) {
      const c = cave.get(y);
      a.push(c && c[x] || ".");
    }
    console.log(a.join(""));
  }
  console.log("");
}

{
  const moves = new Moves(data);

  const ROW_LIMIT = 10000;
  let rocksLeft = 2022;
  let r = 0;
  const cave: Cave = new Map();
  cave.set(0, []);

  const seen = new Map<string,number[]>();
  let maxys:number[] = [];

  outer:
  while (rocksLeft) {
    const keys = Array.from(cave.keys());
    const maxy = Math.max(...keys);
    const start = maxy > 0 ? (maxy + 4) : (r > 0 ? (r + 3) : 3);

    for (const i of keys.filter(v => v < (maxy - ROW_LIMIT))) {
      cave.delete(i);
    }

    const rock = makeRock(r % 5, 2, start);
    // console.log('rock', rock, maxy);
    while (true) {
      const m = moves.next();
      if (m == "<" && rock.x > 0) {
        rock.x--;
        // console.log('  moved', m, rock);
        if (rockWillRest(rock, cave)) {
          rock.x++;
          // console.log('moved back >', rock);
        }
      } else if (m == ">" && rock.x < (7 - rock.w)) {
        rock.x++;
        // console.log('  moved', m, rock);
        if (rockWillRest(rock, cave)) {
          rock.x--;
          // console.log('moved back <', rock);
        }
      } else {
        // console.log('no move', m, rock);
      }
      rock.y--;
      // console.log('rock fell', rock);

      if (rockWillRest(rock, cave)) {
        rock.y++;
        // console.log('rock settled', rock);
        fillWithRock(rock, cave);

        for (const x of range(0, 6)) {
          for (const y of range(maxy, 0)) {
            if (cave.has(y) && cave.get(y)![x] !== undefined) {
              maxys[x] = start - y;
              break;
            }
          }
        }

        const key = `${r%5}:${moves.getIndex()}:${maxys.join(":")}`;
        console.log('key', key);

        if (seen.has(key)) {
          console.log('have seen this combo:', key, start, Math.max(...cave.keys()), seen.get(key), rocksLeft);
        } else {
          seen.set(key, [start, Math.max(...cave.keys()), rocksLeft]);
        }
        break;
      }
    }
    rocksLeft--;
    r++;

    if (rocksLeft % 1_000_000 == 0) {
      console.log(rocksLeft);
    }
  }
  // printCave(cave);

  console.log("part 1:", Math.max(...cave.keys()) + 1);
}

{
  console.log("part 2:", );
}

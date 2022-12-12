import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";
import dijkstra from "https://deno.land/x/dijkstra@1.0.2/mod.ts";

const input = Deno.readTextFileSync("input.txt").trim();

const data: string[][] = R.pipe(
  R.split("\n"),
  R.map(R.split("")),
)(input);

function parse(d: string[][]) {
  const h = d.length;
  const w = d[0].length;
  const data: number[][] = Array(h);
  let start= "";
  let end = "";

  for (let y = 0; y < h; y++) {
    data[y] = Array<number>();
    for (let x = 0; x < w; x++) {
      let i = d[y][x];
      if (i == "S") {
        start = `${x}:${y}`;
        i = "a";
      } else if (i == "E") {
        end = `${x}:${y}`;
        i = "z";
      }
      data[y].push(i.charCodeAt(0) - 96);
    }
  }

  return { start, end, data };
}

function graph(d: number[][]) {
  const h = d.length;
  const w = d[0].length;
  const minx = 1;
  const maxx = w - 2;
  const miny = 1;
  const maxy = h - 2;
  const g:{ [key: string]: { [key: string]: number } } = {};

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const v = d[y][x];
      const n = `${x}:${y}`;
      const e: { [key: string]: number } = {};

      if (y >= miny && ((d[y-1][x] - v) <= 1)) {
        e[`${x}:${y-1}`] = 1;
      }
      if (y <= maxy && ((d[y+1][x] - v) <= 1)) {
        e[`${x}:${y+1}`] = 1;
      }
      if (x >= minx && ((d[y][x-1] - v) <= 1)) {
        e[`${x-1}:${y}`] = 1;
      }
      if (x <= maxx && ((d[y][x+1] - v) <= 1)) {
        e[`${x+1}:${y}`] = 1;
      }
      g[n] = e;
    }
  }

  return g;
}

function lowest(d: number[][]) {
  const h = d.length;
  const w = d[0].length;
  const l: string[] = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (d[y][x] == 1) {
        l.push(`${x}:${y}`);
      }
    }
  }
  return l;
}

{
  const d = parse(data);
  const g = graph(d.data);
  const r = dijkstra.find_path(g, d.start, d.end).length - 1;

  console.log("part 1:", r);
}

{
  const d = parse(data);
  const g = graph(d.data);
  const l = lowest(d.data);

  const r = R.pipe(
    R.map((start: string) => {
      try {
        return dijkstra.find_path(g, start, d.end).length - 1;
      } catch (_) {
        return Infinity;
      }
    }),
    R.sort((a: number, b: number) => a - b),
    R.head,
  )(l);

  console.log("part 2:", r);
}

import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.txt");

const toInt = (val: string) => parseInt(val, 10);

type Row = [string, string, string | number];

const data: Row[] = R.pipe(
  R.split("\n"),
  R.map(R.pipe(R.split(" "), (row: string[]) => {
    const [a, b, c] = row;
    const n = toInt(a);
    return Number.isNaN(n) ? [a, b, c] : ["file", b, n];
  })),
)(input);

function parse(rows: Row[]) {
  const dirs = new Set<string>();
  const files = new Map<string, number>();
  let path = "";
  for (const row of rows) {
    const [type, value, param] = row;

    if (type == "$" && value == "cd") {
      if (param == "/") {
        path = "/";
      } else if (param == "..") {
        path = (path.split("/").slice(0, -2).join("/") + "/");
      } else {
        path = `${path}${param}/`;
      }
      dirs.add(path);
    // } else if (type == "$" && value == "ls") {
    //   console.log("listing", path);
    // } else if (type == "dir") {
    //   console.log("dir", path, value);
    } else if (type == "file") {
      files.set(`${path}${value}`, Number(param));
    }
  }
  return { dirs, files };
}

const tree = parse(data);

{
  const LIMIT = 100_000;
  const totals = [];

  outer:
  for (const dir of tree.dirs.values()) {
    let total = 0;
    for (const [file, size] of tree.files.entries()) {
      if (file.startsWith(dir)) {
        total += size;
      }
      if (total > LIMIT) {
        continue outer;
      }
    }
    totals.push(total);
  }

  console.log("part 1:", R.sum(totals));
}

{
  const MAX = 70_000_000;
  const NEED = 30_000_000;
  const totals: Map<string, number> = new Map();

  for (const dir of tree.dirs.values()) {
    let total = 0;
    for (const [file, size] of tree.files.entries()) {
      if (file.startsWith(dir)) {
        total += size;
      }
    }
    totals.set(dir, total);
  }

  const min = NEED - (MAX - totals.get("/")!);
  const diff = (a: number, b: number) => a - b;

  console.log("part 2:", R.pipe(
    R.sort(diff),
    R.filter(R.lt(min)),
    R.head,
  )(Array.from(totals.values())));
}

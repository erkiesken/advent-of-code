import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.txt").trim();

const toInt = (val: string) => parseInt(val, 10);

const data: number[][] = R.pipe(
  R.split("\n"),
  R.map(R.pipe(R.split(""), R.map(toInt))),
)(input);

{
  const w = R.length(R.head(data));
  const h = R.length(data);

  let vis = 0;
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (c == 0 || r == 0 || c == (w-1) || r == (h-1)) {
        vis++;
        continue;
      }
      const k = data[r][c];
      const hidden = [false, false, false, false];
      for (let rr = r - 1; rr >= 0; rr--) {
        if (data[rr][c] >= k) {
          hidden[0] = true;
          break;
        }
      }
      for (let rr = r + 1; rr < h; rr++) {
        if (data[rr][c] >= k) {
          hidden[1] = true;
          break;
        }
      }
      for (let cc = c - 1; cc >= 0; cc--) {
        if (data[r][cc] >= k) {
          hidden[2] = true;
          break;
        }
      }
      for (let cc = c + 1; cc < w; cc++) {
        if (data[r][cc] >= k) {
          hidden[3] = true;
          break;
        }
      }
      if (R.any(R.equals(false), hidden)) {
        vis++;
      }
    }
  }

  console.log("part 1:", vis);
}

{
  const w = R.length(R.head(data));
  const h = R.length(data);

  const scores: number[] = [];
  for (let r = 1; r < (h-1); r++) {
    for (let c = 1; c < (w-1); c++) {
      const k = data[r][c];
      let top = 0;
      let bottom = 0;
      let left = 0;
      let right = 0;
      for (let rr = r - 1; rr >= 0; rr--) {
        top++;
        if (data[rr][c] >= k) {
          break;
        }
      }
      for (let rr = r + 1; rr < h; rr++) {
        bottom++;
        if (data[rr][c] >= k) {
          break;
        }
      }
      for (let cc = c - 1; cc >= 0; cc--) {
        left++;
        if (data[r][cc] >= k) {
          break;
        }
      }
      for (let cc = c + 1; cc < w; cc++) {
        right++;
        if (data[r][cc] >= k) {
          break;
        }
      }
      const s = top * bottom * left * right;
      scores.push(s);
    }
  }

  console.log("part 2:", Math.max(...scores));
}

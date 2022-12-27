import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.txt").trim();

const toInt = (val: string) => parseInt(val, 10);

type Data = number[];

const data: Data = R.pipe(
  R.split("\n"),
  R.map(toInt),
)(input);

class Num {
  public next: Num;
  public prev: Num;
  constructor(public value: number) {
    this.next = this;
    this.prev = this;
  }

  toString() {
    return `${this.value} (< ${this.prev.value} > ${this.next.value})`;
  }
}

function print(z: Num) {
  const r = [z.value];
  let n = z.next;
  while (n !== z) {
    // console.log(n.toString());
    r.push(n.value);
    n = n.next;
  }
  console.log(r.join(", "));
}

function link(src: Num[]) {
  const max = src.length - 1;

  for (const [i, n] of src.entries()) {
    // head to tail
    if (i === 0) {
      n.prev = src[max];
    }
    // tail to head
    if (i === max) {
      n.next = src[0];
    }
    if (i < max) {
      n.next = src[i+1];
    }
    if (i > 0) {
      n.prev = src[i-1];
    }
  }
}

function apply(src: Num[]) {
  const len = src.length - 1;

  for (const n of src) {
    let v = n.value % len;
    let t = n;
    if (v == 0) {
      // no move
      continue;
    }
    // splice ourself out
    n.prev.next = n.next;
    n.next.prev = n.prev;
    if (v < 0) {
      // walk backwards
      while (v++ < 1) {
        t = t.prev;
      }
    } else if (v > 0) {
      // walk forwards
      while (v-- > 0) {
        t = t.next;
      }
    }
    // patch into new location
    n.prev = t;
    n.next = t.next;
    n.next.prev = n;
    t.next = n;
  }
}

function offsets(zero: Num) {
  const r: number[] = [];
  let i = 0
  let t = zero;
  while (++i) {
    t = t.next;
    if (i == 1000) {
      r.push(t.value);
    } else if (i == 2000) {
      r.push(t.value);
    } else if (i == 3000) {
      r.push(t.value);
      break;
    }
  }
  return r;
}

{
  const src: Num[] = R.map((n: number) => new Num(n), data);
  const zero = R.find(R.propEq("value", 0), src);

  link(src);
  apply(src);

  console.log("part 1:", R.sum(offsets(zero)));
}

{
  const key = 811589153;
  const src: Num[] = R.map((n: number) => new Num(n * key), data);
  const zero = R.find(R.propEq("value", 0), src);

  link(src);
  let i = 1;
  while (i++ <= 10) {
    apply(src);
  }

  console.log("part 2:", R.sum(offsets(zero)));
}

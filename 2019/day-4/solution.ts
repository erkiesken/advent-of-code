import { assertEquals } from 'https://deno.land/std@v0.25.0/testing/asserts.ts';
import { readFileStrSync } from 'https://deno.land/std@v0.25.0/fs/read_file_str.ts';

const start = 206938;
const end = 679128;

let candidates = 0;
let candidates2 = 0;

const re = /(11+|22+|33+|44+|55+|66+|77+|88+|99+|00+)/g;

outer:
for (let i = start; i <= end; i += 1) {
  const matches = i.toString().match(re);
  if (!matches) {
    continue;
  }
  let parts = i.toString().split('');
  for (let n = 1; n < parts.length; n += 1) {
    if (parts[n] < parts[n-1]) {
      continue outer;
    }
  }
  candidates += 1;

  let ok = false;
  for (let m of matches) {
    if (m.length === 2) {
      ok = true;
    }
  }
  if (ok) {
    candidates2 += 1;
  }

  console.log(i, matches, ok);
}


console.log(`Candidate passwords: ${candidates} -- ${candidates2}`);

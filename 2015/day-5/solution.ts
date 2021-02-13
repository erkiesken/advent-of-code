import { readFileStrSync } from 'https://deno.land/std@v0.25.0/fs/read_file_str.ts';

type Data = string[];

const data:Data = readFileStrSync('input.txt').trim().split('\n');

{
  const bad = /ab|cd|pq|xy/;
  const vowels = /[aeiou]/g;
  const same = /aa|bb|cc|dd|ee|ff|gg|hh|ii|jj|kk|ll|mm|nn|oo|pp|qq|rr|ss|tt|uu|vv|ww|xx|yy|zz/;

  function isNice(s: string):boolean {
    if (s.match(bad)) {
      return false;
    }
    if (Array.from(s.matchAll(vowels)).length < 3) {
      return false;
    }
    return s.match(same) !== null;
  }

  const nice = data.filter((word) => isNice(word));

  console.log(`Total nice words, part 1: ${nice.length}`);
}

{
  function isNice(s: string):boolean {
    let found = false;

    // Pairwise search
    for (let i=0; i < (s.length - 3); i++) {
      if (s.indexOf(s.slice(i, i + 2), i + 2) !== -1) {
        found = true;
        break;
      }
    }
    if (!found) {
      return false;
    }

    // Repeating combo search
    for (let i=0; i < s.length - 2; i++) {
      if (s.charCodeAt(i) === s.charCodeAt(i+2)) {
        return true;
      }
    }
    return false;
  }

  console.log('qjhvhtzxzqqjkmpb', isNice('qjhvhtzxzqqjkmpb'));
  console.log('xxyxx', isNice('xxyxx'));
  console.log('uurcxstgmygtbstg', isNice('uurcxstgmygtbstg'));
  console.log('ieodomkazucvgmuy', isNice('ieodomkazucvgmuy'));

  const nice = data.filter((word) => isNice(word));
  console.log(`Total nice words, part 2: ${nice.length}`);
}

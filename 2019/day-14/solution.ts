import { readFileStrSync } from 'https://deno.land/std@v0.25.0/fs/read_file_str.ts';

type ChemAmount = [string, number];
type Reaction = [ChemAmount[], ChemAmount];
type Data = Reaction[];

function parseChem(s: string) {
  const a = s.split(' ');
  const res:ChemAmount = [String(a[1]), parseInt(a[0], 10)];;
  return res;
}
function parse(s: string):Data {
  return s.trim()
    .split('\n')
    .map((line) => {
      const parts = line.split(' => ', 2);
      const takes = parts[0].split(', ').map(parseChem);
      const makes = parseChem(parts[1]);
      return [takes, makes];
    });
}

function indent(by: number) {
  return new Array(by).fill('  ').join('');
}

const input = parse(readFileStrSync('input.txt'));

function solve(data: Data, chem: string, amount: number, extra: Map<string, number>, level = 0) {
  const spc = indent(level);
  // console.log(spc, 'solving', chem, amount);
  if (chem === 'ORE') {
    return amount;
  }
  if (extra.has(chem)) {
    amount -= extra.get(chem);
  }
  extra.set(chem, 0);

  let minAmount = Infinity;
  let minExtra = Infinity

  for (let r of data) {
    if (r[1][0] === chem) {
      const multiple = Math.ceil(amount / r[1][1]);
      const extraProduced = multiple * r[1][1] - amount;

      let total = 0;
      for (let part of r[0]) {
        total += solve(data, part[0], part[1] * multiple, extra, level + 1);
      }

      if (total < minAmount) {
        minAmount = total;
        minExtra = extraProduced;
      }
    }
  }
  // console.log(spc, 'solved', chem, amount, minAmount);
  extra.set(chem, extra.get(chem) + minExtra);
  return minAmount;
}

{
  const data = parse(`
9 ORE => 2 A
8 ORE => 3 B
7 ORE => 5 C
3 A, 4 B => 1 AB
5 B, 7 C => 1 BC
4 C, 1 A => 1 CA
2 AB, 3 BC, 4 CA => 1 FUEL
`);
  const total = solve(data, 'FUEL', 1, new Map());
  console.log(`Total ORE needed: ${total}`);
}

{
  const data = parse(`
157 ORE => 5 NZVS
165 ORE => 6 DCFZ
44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
179 ORE => 7 PSHF
177 ORE => 5 HKGWZ
7 DCFZ, 7 PSHF => 2 XJWVT
165 ORE => 2 GPVTF
3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT
`);
  const total = solve(data, 'FUEL', 1, new Map());
  console.log(`Total ORE needed: ${total}`);
}

{
  const data = parse(`
2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG
17 NVRVD, 3 JNWZP => 8 VPVL
53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
22 VJHF, 37 MNCFX => 5 FWMGM
139 ORE => 4 NVRVD
144 ORE => 7 JNWZP
5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC
5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV
145 ORE => 6 MNCFX
1 NVRVD => 8 CXFTF
1 VJHF, 6 MNCFX => 4 RFSQX
176 ORE => 6 VJHF
`);
  const total = solve(data, 'FUEL', 1, new Map());
  console.log(`Total ORE needed: ${total}`);
}
{
  const data = parse(`
171 ORE => 8 CNZTR
7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
114 ORE => 4 BHXH
14 VRPVC => 6 BMBT
6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
5 BMBT => 4 WPTQ
189 ORE => 9 KTJDG
1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
12 VRPVC, 27 CNZTR => 2 XDBXC
15 KTJDG, 12 BHXH => 5 XCVML
3 BHXH, 2 VRPVC => 7 MZWV
121 ORE => 7 VRPVC
7 XCVML => 6 RJRHP
5 BHXH, 4 VRPVC => 5 LTCX
`);
  const total = solve(data, 'FUEL', 1, new Map());
  console.log(`Total ORE needed: ${total}`);
}

{
  const total = solve(input, 'FUEL', 1, new Map());
  console.log(`Total ORE needed: ${total}`);
}

{
  let low = 0;
  let high = 1e12;
  let mid;
  while (low < high) {
    mid = Math.floor((low + high + 1) / 2);
    if (solve(input, 'FUEL', mid, new Map()) < 1e12) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }
  console.log(`Maximum FUEL produced: ${low}`);
}

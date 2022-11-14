import { readFileSync } from 'fs';

const input = readFileSync('input.txt').toString();

const data = input
      .split('\n')
      .map((item) => item.split(''));

{
  let g, e = 0;

  const gbits = [];
  const ebits = [];
  const size = data[0].length;

  for (let i = 0; i < size; i++) {
    let ones = 0;
    let zeros = 0;
    for (let item of data) {
      if (item[i] == '0') {
        zeros += 1;
      } else if (item[i] == '1') {
        ones += 1;
      }
    }
    if (ones > zeros) {
      gbits.push('1');
      ebits.push('0');
    } else {
      gbits.push('0');
      ebits.push('1');
    }
  }
  g = parseInt(gbits.join(''), 2);
  e = parseInt(ebits.join(''), 2);

  const result = g * e;
  console.log('part 1:', result);
}

{
  let oi = data;
  let ci = data;
  const size = data[0].length;

  for (let i = 0; i < size; i++) {
    let ones = 0;
    let zeros = 0;
    for (let item of oi) {
      if (item[i] == '0') {
        zeros += 1;
      } else if (item[i] == '1') {
        ones += 1;
      }
    }
    if (ones == zeros || ones > zeros) {
      oi = oi.filter((item) => item[i] == '1');
    } else {
      oi = oi.filter((item) => item[i] == '0');
    }
    if (oi.length == 1) break;
  }
  for (let i = 0; i < size; i++) {
    let ones = 0;
    let zeros = 0;
    for (let item of ci) {
      if (item[i] == '0') {
        zeros += 1;
      } else if (item[i] == '1') {
        ones += 1;
      }
    }
    if (ones == zeros || ones > zeros) {
      ci = ci.filter((item) => item[i] == '0');
    } else {
      ci = ci.filter((item) => item[i] == '1');
    }
    if (ci.length == 1) break;
  }
  const oxy = parseInt(oi[0].join(''), 2);
  const co2 = parseInt(ci[0].join(''), 2);

  const result = oxy * co2;
  console.log('part 2:', result);
}

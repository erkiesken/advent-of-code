const fs = require('fs');
const path = require('path');
const { compose, map, reject, isEmpty, trim, split, reduce, add } = require('ramda');

const input = fs.readFileSync(path.resolve('./input.txt'), 'utf-8');

const lines = compose(
  map((n) => parseInt(n, 10)),
  reject(isEmpty),
  map(trim),
  split('\n')
)(input);


const SUM = 2020;

{
  let i = 0;
  let j, k, num1, num2;
  const l = lines.length;

  outer:
  for (i = 0; i < l; i++) {
    num1 = lines[i];

    for (j = i + 1; j < l; j++) {
      num2 = lines[j];

      if ((num1 + num2) === SUM) {
        break outer;
      }
    }
  }

  // console.log(num1, num2, num1 + num2, num1 * num2);
  console.log('Step 1 result:', num1 * num2);
}

{
  let i = 0;
  let j, k, num1, num2, num3;
  const l = lines.length;

  outer:
  for (i = 0; i < l; i++) {
    num1 = lines[i];

    for (j = i + 1; j < l; j++) {
      num2 = lines[j];

      for (k = j + 1; k < l; k++) {
        num3 = lines[k];

        if ((num1 + num2 + num3) === SUM) {
          break outer;
        }
      }
    }
  }

  // console.log(num1, num2, num3, num1 + num2 + num3, num1 * num2 * num3);
  console.log('Step 2 result:', num1 * num2 * num3);
}

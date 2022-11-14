import { readFileSync } from 'fs';
import { pipe, __, join, split, map, clone, append, prepend, flatten, replace, sum } from 'ramda';

const input = readFileSync('input.txt', { encoding: 'utf-8' }).trim();

const data = pipe(
  split('\n\n'),
  ([alg, img]) => {
    return ({
      alg: pipe(
        replace(/\n/g, ''),
        split(''),
        map(v => v == '.' ? 0 : 1),
      )(alg),
      img: pipe(
        split('\n'),
        map(pipe(split(''), map(v => v == '.' ? 0 : 1))),
      )(img),
    });
  },
)(input);

{
  let result = null;

  const alg = data.alg;
  let img = clone(data.img);
  let repeat = 50;
  let bg = 0;

  function expand(img) {
    const size = img.length;
    return pipe(
      map(pipe(prepend(bg), append(bg))),
      append(Array(size+2).fill(bg)),
      prepend(Array(size+2).fill(bg)),
    )(img);
  }

  function render(img) {
    return pipe(
      map(join('')),
      join('\n'),
      (s) => s.replace(/0/g, ' ').replace(/1/g, '#'),
    )(img);
  }

  function getbit(img, r, c) {
    if (r < 0 || r >= img.length || c < 0 || c >= img.length) return bg;
    return img[r][c];
  }

  function getbits(img, r, c) {
    return [
      getbit(img, r - 1, c - 1), getbit(img, r - 1, c), getbit(img, r - 1, c + 1),
      getbit(img, r, c - 1), getbit(img, r, c), getbit(img, r, c + 1),
      getbit(img, r + 1, c - 1), getbit(img, r + 1, c), getbit(img, r + 1, c + 1),
    ].join('');
  }

  function applyalg(alg, img) {
    const res = clone(img);
    const size = img.length;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const bits = getbits(img, r, c);
        const val = alg[parseInt(bits, 2)];
        // console.log(r, c, bits, parseInt(bits, 2), val);
        res[r][c] = val;
      }
    }
    return res;
  }

  let i = 0;
  while (++i <= repeat) {
    img = applyalg(alg, expand(img));
    bg = bg === 1 ? alg[alg.length-1] : alg[0];

    if (i == 2) {
      result = pipe(
        flatten,
        sum,
      )(img);
      console.log('part 1:', result);
    }
    // console.log(render(img));
  }

  result = pipe(
    flatten,
    sum,
  )(img);
  console.log('part 2:', result);
}

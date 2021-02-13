import { Md5 } from 'https://raw.githubusercontent.com/cotag/ts-md5/master/src/md5.ts';

const data = 'iwrupvqb';

{
  const prefix = '00000';
  let i = 0;
  let hash;
  while (++i) {
    hash = Md5.hashStr(`${data}${i}`);
    if (hash.startsWith(prefix)) {
      break;
    }
  }
  console.log(`Found lowest match for ${prefix}: ${i}`);
}

{
  const prefix = '000000';
  let i = 0;
  let hash;
  while (++i) {
    hash = Md5.hashStr(`${data}${i}`);
    if (hash.startsWith(prefix)) {
      break;
    }
  }
  console.log(`Found lowest match for ${prefix}: ${i}`);
}

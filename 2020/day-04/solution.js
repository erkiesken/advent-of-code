const fs = require('fs');
const path = require('path');
const { compose, length, map, split, replace, fromPairs, has, allPass, anyPass, filter, lte, gte, where, test, contains, __ } = require('ramda');

const input = fs.readFileSync(path.resolve('./input.txt'), 'utf-8');

const data = compose(
  map(compose(
    fromPairs,
    map(split(':')),
    split(' '),
    replace(/\n/g, ' '),
  )),
  split('\n\n')
)(input);

{
  const validPass = allPass([
    has('byr'), // (Birth Year)
    has('iyr'), // (Issue Year)
    has('eyr'), // (Expiration Year)
    has('hgt'), // (Height)
    has('hcl'), // (Hair Color)
    has('ecl'), // (Eye Color)
    has('pid'), // (Passport ID)
    // has('cid'), // (Country ID)
  ]);

  const result = compose(
    length,
    filter(validPass),
  )(data);

  console.log('Part 1 result:', result);
}

{
  const hRE = /^(?<value>\d+)(?<unit>cm|in)$/;

  const validPass = allPass([
    has('byr'), // (Birth Year)
    has('iyr'), // (Issue Year)
    has('eyr'), // (Expiration Year)
    has('hgt'), // (Height)
    has('hcl'), // (Hair Color)
    has('ecl'), // (Eye Color)
    has('pid'), // (Passport ID)
    // has('cid'), // (Country ID)

    where({
      // byr (Birth Year) - four digits; at least 1920 and at most 2002.
      'byr': allPass([lte('1920'), gte('2002')]),
      // iyr (Issue Year) - four digits; at least 2010 and at most 2020.
      'iyr': allPass([lte('2010'), gte('2020')]),
      // eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
      'eyr': allPass([lte('2020'), gte('2030')]),
      // hgt (Height) - a number followed by either cm or in:
      // If cm, the number must be at least 150 and at most 193.
      // If in, the number must be at least 59 and at most 76.
      'hgt': (val) => {
        const m = hRE.exec(val);
        if (m && m.groups.unit === 'cm') {
          return allPass([lte('150'), gte('193')])(m.groups.value);
        } else if (m && m.groups.unit === 'in') {
          return allPass([lte('59'), gte('76')])(m.groups.value);
        }
        return false;
      },
      // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
      'hcl': test(/^#[0-9a-f]{6}$/),
      // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
      'ecl': contains(__, split(' ', 'amb blu brn gry grn hzl oth')),
      // pid (Passport ID) - a nine-digit number, including leading zeroes.
      'pid': test(/^\d{9}$/),
      // cid (Country ID) - ignored, missing or not.
    }),
  ]);

  const result = compose(
    length,
    filter(validPass),
  )(data);

  console.log('Part 2 result:', result);
}

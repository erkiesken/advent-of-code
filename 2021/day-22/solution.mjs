import { readFileSync } from 'fs';
import { pipe, clone, split, map, sum } from 'ramda';

const input = readFileSync('input.txt', { encoding: 'utf-8' }).trim();

const re = /^(?<state>on|off) x=(?<xmin>-?\d+)\.\.(?<xmax>-?\d+),y=(?<ymin>-?\d+)\.\.(?<ymax>-?\d+),z=(?<zmin>-?\d+)\.\.(?<zmax>-?\d+)$/;

const data = pipe(
  split('\n'),
  map((s) => {
    const m = re.exec(s);
    return ({
      state: m.groups.state == 'on' ? 1 : 0,
      cuboid: {
        xmin: Number(m.groups.xmin),
        ymin: Number(m.groups.ymin),
        zmin: Number(m.groups.zmin),
        xmax: Number(m.groups.xmax),
        ymax: Number(m.groups.ymax),
        zmax: Number(m.groups.zmax),
      },
    });
  }),
)(input);

function cuboidsIntersect(a, b) {
  return (
    a.xmin <= b.xmax && a.xmax >= b.xmin
    && a.ymin <= b.ymax && a.ymax >= b.ymin
    && a.zmin <= b.zmax && a.zmax >= b.zmin
  );
}

function cuboidsIntersection(a, b) {
  return {
    xmin: Math.max(a.xmin, b.xmin),
    xmax: Math.min(a.xmax, b.xmax),
    ymin: Math.max(a.ymin, b.ymin),
    ymax: Math.min(a.ymax, b.ymax),
    zmin: Math.max(a.zmin, b.zmin),
    zmax: Math.min(a.zmax, b.zmax),
  };
}

function cuboidSize(c) {
  return (
    (c.xmax - c.xmin + 1)
    * (c.ymax - c.ymin + 1)
    * (c.zmax - c.zmin + 1)
  );
}

function cuboidPoints(c) {
  const p = [];
  for (let x = c.xmin; x <= c.xmax; x++) {
    for (let y = c.ymin; y <= c.ymax; y++) {
      for (let z = c.zmin; z <= c.zmax; z++) {
        p.push([x, y, z]);
      }
    }
  }
  return p;
}

{
  let result = null;
  const steps = clone(data);

  const enabled = new Array(100 * 100 * 100).fill(0);

  steps.forEach(({ state, cuboid }) => {
    if ([cuboid.xmin, cuboid.ymin, cuboid.zmin, cuboid.xmax, cuboid.ymax, cuboid.zmax].some(v => Math.abs(v) > 50)) {
      // outside of -50..50
      return;
    }
    cuboidPoints(cuboid).forEach(([x, y, z]) => {
      enabled[(x + 50) + (y + 50) * 100 + (z + 50) * 100 * 100] = state;
    });
  });

  result = sum(enabled);

  console.log('part 1:', result);
}

const tostr = (o) => JSON.stringify(o);
const fromstr = (s) => JSON.parse(s);

{
  let result = null;
  const steps = clone(data);
  let areas = new Map();

  for (const { state, cuboid } of steps) {
    const updated = new Map();

    if (state === 1) {
      const key = tostr(cuboid);
      updated.set(key, (updated.get(key) ?? 0) + 1);
    }

    for (const [key, value] of areas) {
      const c = fromstr(key);
      if (cuboidsIntersect(cuboid, c)) {
        const xc = tostr(cuboidsIntersection(cuboid, c));
        updated.set(xc, (updated.get(xc) ?? 0) - value);
      }
    }

    for (const [key, value] of updated) {
      areas.set(key, (areas.get(key) ?? 0) + value);
    }
  }

  result = [...areas].map(([key, value]) => cuboidSize(fromstr(key)) * value).reduce((a, b) => a + b);

  console.log('part 2:', result);
}

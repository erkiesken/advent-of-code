import { readFileSync } from 'fs';
import assert from 'assert';
import { pipe, split, map, __, flatten, prop, sum, reduce, multiply, gt, lt, equals, min, max } from 'ramda';

const input = readFileSync('input.txt', { encoding: 'utf-8' }).trim();

const data = pipe(
  split(''),
)(input);

const bits = {
  '0': [0,0,0,0],
  '1': [0,0,0,1],
  '2': [0,0,1,0],
  '3': [0,0,1,1],
  '4': [0,1,0,0],
  '5': [0,1,0,1],
  '6': [0,1,1,0],
  '7': [0,1,1,1],
  '8': [1,0,0,0],
  '9': [1,0,0,1],
  'A': [1,0,1,0],
  'B': [1,0,1,1],
  'C': [1,1,0,0],
  'D': [1,1,0,1],
  'E': [1,1,1,0],
  'F': [1,1,1,1],
};

const buf = pipe(
  map(prop(__, bits)),
  flatten,
)(data);

class BitBuf {
  constructor(buf, offset = 0) {
    this.buf = buf;
    this.offset = offset;
  }

  read(n) {
    const v = this.peek(n);
    this.seek(n);
    return v;
  }

  seek(n) {
    this.offset += n;
  }

  next() {
    return this.offset < this.buf.length - 8;
  }

  peek(n) {
    if (this.buf.length < this.offset + n) {
      throw new Error(`Peeking too far at offset ${this.offset} + ${n}`);
    }
    return this.buf.slice(this.offset, this.offset + n);
  }

  readInt(n) {
    return parseInt(this.read(n).join(''), 2);
  }
}

class Packet {
  constructor(version, type) {
    this.version = version;
    this.type = type;
    this.children = [];
    this.value = null;
  }

  add(p) {
    this.children.push(p);
    return this;
  }
}

class PacketReader {
  constructor(bitbuf) {
    this.bitbuf = bitbuf;
  }

  parse() {
    const packets = [];

    while (this.bitbuf.next()) {
      packets.push(this.parseOne(this.bitbuf));
    }

    return packets;
  }

  parseOne(bb) {
    const version = bb.readInt(3);
    const type = bb.readInt(3);

    const p = new Packet(version, type);
    if (type === 4) {
      p.value = this.readLiteral(bb);
      return p;
    }

    const lentype = bb.readInt(1);
    if (lentype == 0) {
      const bits = bb.readInt(15);
      const buf = new BitBuf(bb.read(bits));
      p.children = new PacketReader(buf).parse();
    } else {
      let len = bb.readInt(11);
      while (len--) {
        p.children.push(this.parseOne(bb));
      }
    }
    return p;
  }

  readLiteral(bb) {
    const bits = [];
    let val;
    while (true) {
      val = bb.read(5);
      bits.push(val.slice(1,5));
      if (val[0] == 0) {
        break;
      }
    }
    return parseInt(flatten(bits).join(''), 2);
  }
}

{
  let result = null;

  const p = new PacketReader(new BitBuf(buf));
  const packets = p.parse();

  function walk(packets) {
    let r = []
    for (const p of packets) {
      r = r.concat([p, ...walk(p.children)]);
    }
    return r;
  }

  result = pipe(
    map(prop('version')),
    sum,
  )(walk(packets));

  console.log('part 1:', result);
}

{
  let result = null;

  const p = new PacketReader(new BitBuf(buf));
  const packets = p.parse();

  function solve(packet) {
    const { type, children, value } = packet;
    switch (type) {
      case 0:
        return sum(map(solve, children));
      case 1:
        return reduce(multiply, 1, map(solve, children));
      case 2:
        return reduce(min, Infinity, map(solve, children));
      case 3:
        return reduce(max, -Infinity, map(solve, children));
      case 4:
        return value;
      case 5:
        assert(children.length == 2, 'bad gt children');
        return gt(...map(solve, children)) ? 1 : 0;
      case 6:
        assert(children.length == 2, 'bad lt children');
        return lt(...map(solve, children)) ? 1 : 0;
      case 7:
        assert(children.length == 2, 'bad eq children');
        return equals(...map(solve, children)) ? 1 : 0;
      default:
        throw new Error(`Unknown packet type: ${type}`);
    }
  }

  result = solve(packets[0]);

  console.log('part 2:', result);
}

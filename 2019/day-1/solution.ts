import { assertEquals } from 'https://deno.land/std@v0.25.0/testing/asserts.ts';

const decoder = new TextDecoder('utf-8');
const data = decoder.decode(Deno.readFileSync('input.txt'));

function massToFuel(value) {
  return Math.max(0, Math.floor(value / 3) - 2);
}

function withExtraFuel(value) {
  let fuel = massToFuel(value);
  let remaining = massToFuel(fuel);
  while (remaining > 0) {
    fuel += remaining;
    remaining = massToFuel(remaining);
  }
  return fuel;
}

assertEquals(massToFuel(12), 2);
assertEquals(massToFuel(14), 2);
assertEquals(massToFuel(1969), 654);
assertEquals(massToFuel(100756), 33583);
assertEquals(withExtraFuel(14), 2);
assertEquals(withExtraFuel(1969), 966);
assertEquals(withExtraFuel(100756), 50346);

const lines = data.split('\n').map((line) => parseInt(line, 10)).filter((value) => !isNaN(value));

const fuel = lines.reduce((acc, line) => acc + massToFuel(line), 0);
console.log('Fuled Upper-Counter:', fuel);

const fuelTotal = lines.reduce((acc, line) => acc + withExtraFuel(line), 0);
console.log('Total Fule Upper-Counter:', fuelTotal);

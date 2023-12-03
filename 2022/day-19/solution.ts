import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.test.txt").trim();

const toInt = (val: string) => parseInt(val, 10);

const inputRE = /Blueprint (?<id>\d+): Each ore robot costs (?<orebot_ore>\d+) ore. Each clay robot costs (?<claybot_ore>\d+) ore. Each obsidian robot costs (?<obsbot_ore>\d+) ore and (?<obsbot_clay>\d+) clay. Each geode robot costs (?<geode_ore>\d+) ore and (?<geode_obs>\d+) obsidian./;

type Recipe = {
  id: number,
  orebot_ore: number,
  claybot_ore: number,
  obsbot_ore: number,
  obsbot_clay: number,
  geode_ore: number,
  geode_obs: number,
}

const data: Recipe[] = R.pipe(
  R.split("\n"),
  R.map((line: string) => R.map(toInt, line.match(inputRE)!.groups)),
)(input);

type BotType = "ore" | "clay" | "obsidian" | "geode";

type Store = {
  [key: string]: number,
};

function makeStore() {
  return {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geode: 0,
  };
}

type Cost = { [key: string]: number };

class Bot {
  constructor(public type: BotType) {}

  tick() {
    return { [this.type]: 1 };
  }
}

class Factory {
  public bots: Bot[];
  public store: Store;
  private next?: Bot;

  constructor(public recipe: Recipe) {
    this.bots = [];
    this.store = makeStore();
  }

  clone() {
    const f = new Factory(this.recipe);
    f.store = { ...this.store };
    f.bots = [...this.bots];
    return f;
  }

  spend(cost: Cost) {
    for (const [key, value] of Object.entries(cost)) {
      this.store[key] -= value;
    }
  }

  collect(cost: Cost) {
    for (const [key, value] of Object.entries(cost)) {
      this.store[key] += value;
    }
  }

  add(bot: Bot) {
    this.bots.push(bot);
  }

  make(type: BotType) {
    return new Bot(type);
  }

  queue(type: BotType) {
    this.next = this.make(type);
  }

  evolve() {
    const r = this.recipe;
    const s = this.store;

    const possible = new Map<BotType, Cost>();

    if (s.ore >= r.geode_ore && s.obsidian >= r.geode_obs) {
      possible.set("geode", { ore: r.geode_ore, obsidian: r.geode_obs });
    }
    if (s.ore >= r.obsbot_ore && s.clay >= r.obsbot_clay) {
      possible.set("obsidian", { ore: r.obsbot_ore, clay: r.obsbot_clay });
    }
    if (s.ore >= r.claybot_ore) {
      possible.set("clay", { ore: r.claybot_ore });
    }
    if (s.ore >= r.orebot_ore) {
      possible.set("ore", { ore: r.orebot_ore });
    }

    return possible;
  }

  tick() {
    if (this.next) {
      // console.log("added bot", this.next.type);
      this.add(this.next);
      this.next = undefined;
    }

    for (const b of this.bots) {
      this.collect(b.tick());
    }
  }
}

{
  const recipe = data[0];

  const factory = new Factory(recipe);
  factory.add(factory.make("ore"));

  let factories = [factory];

  let i = 0;
  while (++i <= 24) {
    console.log("minute", i);
    console.log("factories before evolve", factories.length);

    factories = R.pipe(
      R.map((f: Factory) => {
        const nexts = f.evolve();
        const clones: Factory[] = [];
        for (const [type, cost] of nexts.entries()) {
          const c = f.clone();
          c.spend(cost);
          c.queue(type);
          clones.push(c);
        }
        return [f, ...clones];
      }),
      R.flatten,
    )(factories);

    console.log("factories after evolve", factories.length);
    for (const f of factories) {
      f.tick();
    }
    break;
  }

  console.log("part 1:", );
}

{
  console.log("part 2:", );
}

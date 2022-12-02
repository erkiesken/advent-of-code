import * as R from "https://deno.land/x/ramda@v0.27.2/mod.ts";

const input = Deno.readTextFileSync("input.txt").trim();

const data = R.pipe(
  R.split("\n"),
  R.map(
    R.split(" "),
  ),
)(input);

const scores: { [key: string]: number } = {
  A: 1, // rock
  X: 1,
  B: 2, // paper
  Y: 2,
  C: 3, // scissors
  Z: 3,
};

const getScore = (them: string, us: string) => {
  // a tie
  if ((them == "A" && us == "X") || (them == "B" && us == "Y") || (them == "C" && us == "Z")) {
    return 3 + scores[us];
  }
  // lose
  else if ((them == "A" && us == "Z") || (them == "B" && us == "X") || (them == "C" && us == "Y")) {
    return 0 + scores[us];
  } // win
  else {
    return 6 + scores[us];
  }
}

{
  let score = 0;

  for (const [them, us] of data) {
    score += getScore(them, us)
  }

  console.log("part 1:", score);
}

{
  let score = 0;

  const losing: { [key: string]: string } = {
    A: "Z",
    B: "X",
    C: "Y",
  };
  const drawing: { [key: string]: string } = {
    A: "X",
    B: "Y",
    C: "Z",
  };
  const winning: { [key: string]: string } = {
    A: "Y",
    B: "Z",
    C: "X",
  };

  for (const [them, us] of data) {
    if (us == "X") {
      score += getScore(them, losing[them])
    } else if (us == "Y") {
      score += getScore(them, drawing[them])
    } else if (us == "Z") {
      score += getScore(them, winning[them])
    }
  }

  console.log("part 2:", score);
}

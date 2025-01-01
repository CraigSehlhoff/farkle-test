import { DiceValue } from "../types";

export function calcScore(dice: DiceValue[]) {
  if (!dice || dice.length === 0) return 0;

  // Count occurrences of each value
  const counts = new Array(7).fill(0);
  const values = dice.map((d) => d.value);
  values.forEach((v) => counts[v]++);

  let score = 0;

  // Check for straight (1-2-3-4-5-6)
  if (values.length === 6 && counts.slice(1).every((c) => c === 1)) {
    return 1500;
  }

  // Check for three pairs
  if (
    values.length === 6 &&
    counts.slice(1).filter((c) => c === 2).length === 3
  ) {
    return 1500;
  }

  // Check for two triplets
  if (
    values.length === 6 &&
    counts.slice(1).filter((c) => c === 3).length === 2
  ) {
    return 2500;
  }

  // Check each number for scoring combinations
  for (let i = 1; i <= 6; i++) {
    const count = counts[i];

    if (count >= 3) {
      // Three or more of a kind
      if (i === 1) {
        score += 1000 * Math.pow(2, count - 3);
        counts[i] -= 3;
      } else {
        score += i * 100 * Math.pow(2, count - 3);
        counts[i] -= 3;
      }
    }

    // Add remaining 1s and 5s
    if (i === 1) {
      score += counts[i] * 100;
    } else if (i === 5) {
      score += counts[i] * 50;
    }
  }

  return score;
}

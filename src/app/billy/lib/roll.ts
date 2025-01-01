import { DiceValue } from "../types";

function generateDice(): DiceValue {
  return {
    held: false,
    isScored: false,
    value: Math.round(Math.random() * 5) + 1,
    id: crypto.randomUUID(),
  };
}

export function rollDice(numToRoll: number = 6) {
  return Array.from({ length: numToRoll }, generateDice);
}

export function separateDice(dice?: DiceValue[] | null): {
  heldDice: DiceValue[] | null;
  rollingDice: DiceValue[] | null;
} {
  return (
    dice?.reduce(
      (acc, curr) => {
        if (curr.held) {
          acc.heldDice.push(curr);
        } else {
          acc.rollingDice.push(curr);
        }
        return acc;
      },
      { heldDice: [] as DiceValue[], rollingDice: [] as DiceValue[] }
    ) || { heldDice: null, rollingDice: null }
  );
}

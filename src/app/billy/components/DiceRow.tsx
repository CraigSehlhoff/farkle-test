import { DiceValue } from "../types";
import { DiceImage } from "./DiceImage";

export function DiceRow({
  dice,
  onDiceClick,
}: {
  dice: DiceValue[];
  onDiceClick: (id: string) => void;
}) {
  return (
    <div className="flex flex-row gap-1">
      {dice.map(({ value, id }) => (
        <DiceImage value={value} id={id} key={id} onClick={onDiceClick} />
      ))}
    </div>
  );
}

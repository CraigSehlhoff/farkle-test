import { DiceImage } from "./DiceImage";

export function ZeroState() {
  return (
    <div className="flex flex-row gap-1">
      {Array.from({ length: 6 }, () => ({
        value: 1,
        id: crypto.randomUUID(),
      })).map(({ value, id }) => (
        <DiceImage value={value} id={id} key={id} />
      ))}
    </div>
  );
}

import NextImage from "next/image";

export function DiceImage({
  id,
  value,
  onClick,
}: {
  id: string;
  value: number;
  onClick?: (id: string) => void;
}) {
  return (
    <button onClick={() => onClick?.(id)}>
      <NextImage
        src={`/images/die${value}.svg`}
        width={100}
        height={100}
        alt={`Die ${value}`}
        className={"rounded-xl items-center mt-10"}
      />
    </button>
  );
}

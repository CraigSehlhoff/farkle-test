"use client";
import Image from "next/image";

export const diceImages = [
  "/images/die1.svg",
  "/images/die2.svg",
  "/images/die3.svg",
  "/images/die4.svg",
  "/images/die5.svg",
  "/images/die6.svg",
];

interface DiceProps {
  value: number;
  held: boolean;
  holdDie: (id: number) => void;
  id: string;
}

export function Dice({ value, held, holdDie }: DiceProps) {
  return (
    <div className="bg-red-600 rounded-xl">
      <Image
        src={diceImages[value - 1]}
        width={100}
        height={100}
        alt={`Die ${value}`}
        className={
          !held ? "rounded-xl opacity-95" : "rounded-xl bg-red-100 opacity-80"
        }
        onClick={() => holdDie(value)}
      />
    </div>
  );
}

"use client";
import { useState } from "react";
import { DiceValue } from "./types";
import { rollDice, separateDice } from "./lib/roll";
import { DiceRow } from "./components/DiceRow";
import { ZeroState } from "./components/ZeroState";
import { Button } from "./components/ui/Button";
import { calcScore } from "./lib/score";

export default function Page() {
  const [dice, setDice] = useState<DiceValue[] | null>();
  const [heldScore, setHeldScore] = useState(0);
  const [turnScore, setTurnScore] = useState(0);
  const [gameScore, setGameScore] = useState(0);

  const { heldDice, rollingDice } = separateDice(dice);

  function continueTurn() {
    const diceToRoll = 6 - (heldDice?.length ?? 0);
    const newDice = rollDice(diceToRoll);
    setTurnScore((prev) => prev + heldScore);
    setHeldScore(0);
    setDice([
      ...(heldDice ?? []).map((dice) => ({ ...dice, isScored: true })),
      ...newDice,
    ]);
  }

  function endTurn() {
    setGameScore((prev) => prev + turnScore);
    setTurnScore(0);
    setDice(null);
  }

  function toggleHoldDice(id: string) {
    const newDice = dice?.map((die) =>
      die.id === id ? { ...die, held: !die.held } : die
    );
    const newHeldDice = newDice?.filter((die) => die.held);
    const unScoredHeldDice = newHeldDice?.filter((die) => !die.isScored);
    setHeldScore(unScoredHeldDice?.length ? calcScore(unScoredHeldDice) : 0);
    setDice(newDice);
  }

  if (!dice || !rollingDice || !heldDice) {
    return (
      <>
        <ZeroState />
        <Button onClick={continueTurn}>New Game</Button>
      </>
    );
  }

  const isFarkle = !rollingDice.some(
    (die) => die.value === 1 || die.value === 5
  );

  return (
    <>
      {isFarkle && <h2 className="text-2xl">Farkle?</h2>}
      {
        <h2 className="text-2xl">
          Game Score: {gameScore ?? "No score yet, loser"}
        </h2>
      }
      {<h2 className="text-2xl">Turn Score: {turnScore}</h2>}

      {!dice ? (
        <ZeroState />
      ) : (
        <DiceRow dice={rollingDice ?? dice} onDiceClick={toggleHoldDice} />
      )}
      {heldDice && <h2 className="text-2xl">Held Score: {heldScore}</h2>}
      {heldDice && <DiceRow dice={heldDice} onDiceClick={toggleHoldDice} />}
      <div className="flex flex-row gap-2">
        <Button onClick={continueTurn}>Roll Dice</Button>
        <Button onClick={endTurn}>End Turn</Button>
      </div>
    </>
  );
}

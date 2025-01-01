"use client";
import { useEffect } from "react";
import { DiceValue } from "../page";
import React from "react";

const calcScore = (diceValue: DiceValue[]) => {
  //counts how many of each die value there are
  const counts = new Array(7).fill(0);
  console.log("🚀 ~ calcScore ~ counts:", counts);
  //creates a new array based on the value of each die
  const values = diceValue.map((d) => d.value);
  console.log("🚀 ~ calcScore ~ values:", values);
  values.forEach((v) => counts[v]++);

  let score = 0;

  // check for a straight
  if (values.length === 6 && counts.slice(1).every((c) => c === 1)) {
    return 1500;
  }

  // check for three pairs
  if (
    values.length === 6 &&
    counts.slice(1).filter((c) => c === 2).length === 3
  ) {
    return 1500;
  }

  diceValue.forEach((die) => {
    if (die.value === 1) {
      score += 100;
    }
    if (die.value === 5) {
      score += 50;
    }
  });
  return score;
};

export default function useGameScoring(
  diceValue: DiceValue[],
  setDiceValue: React.Dispatch<React.SetStateAction<DiceValue[]>>,
  turnScore: number,
  setTurnScore: React.Dispatch<React.SetStateAction<number>>,
  possibleRollScore: number,
  setPossibleRollScore: React.Dispatch<React.SetStateAction<number>>,
  farkle: boolean,
  setFarkle: React.Dispatch<React.SetStateAction<boolean>>,
  rollDice: () => void,
  keepRolling: boolean,
  setKeepRolling: React.Dispatch<React.SetStateAction<boolean>>,
  canPlay: boolean,
  setCanPlay: React.Dispatch<React.SetStateAction<boolean>>
) {
  const numPrevDiceHeld = React.useRef(0);

  const newPossibleRollScore = calcScore(diceValue.filter((die) => !die.held));
  const [roundScore, setRoundScore] = React.useState(0);

  useEffect(() => {
    console.log("USE EFFECT RUNNING");
    const numDiceHeld = diceValue.reduce((acc, curr) => {
      if (curr.held) {
        acc += 1;
      }
      return acc;
    }, 0);
    setPossibleRollScore(newPossibleRollScore);

    if (numDiceHeld >= 0) {
      const newTurnScore = calcScore(diceValue.filter((die) => die.held));
      console.log("🚀 ~ useEffect ~ newTurnScore:", newTurnScore);

      if (keepRolling) {
        setTurnScore(roundScore + newTurnScore);
        console.log("different place turn score:", turnScore);

        if (numDiceHeld === 6) {
          setRoundScore(turnScore);
          console.log("keepRolling:", roundScore);
        }
      }

      if (!keepRolling) {
        setTurnScore(newTurnScore);
      }

      if (numDiceHeld === 6) {
        setTurnScore(newTurnScore);
        setRoundScore(keepRolling ? turnScore : newTurnScore);
        setDiceValue((oldDice) =>
          oldDice.map((prevValue) => ({ ...prevValue, held: false }))
        );
        setFarkle(false);
        rollDice();
        setKeepRolling(true);
        console.log("new turnscore if 6 held die:", newTurnScore);
      }
    }

    if (
      newPossibleRollScore === 0 &&
      possibleRollScore === 0 &&
      turnScore !== 0 &&
      diceValue.some(
        (die) =>
          (!die.held && die.value !== 1) || (!die.held && die.value !== 5)
      )
    ) {
      setFarkle(true);
      console.log("Farkle!");
    }

    console.log("🚀 ~ numPrevDiceHeld:", numPrevDiceHeld);
    console.log("🚀 ~ useEffect ~ newPossibleRollScore:", newPossibleRollScore);
    console.log("🚀 ~ useEffect ~ numDiceHeld:", numDiceHeld);
    console.log("🚀 ~ useEffect ~ turnScore:", turnScore);
    console.log("🚀 ~ useEffect ~ roundScore:", roundScore);
    console.log("🚀 ~ useEffect ~ keepRolling:", keepRolling);
    // Always update this, at the end of all of this logic.
    //! IF YOU RETURN BEFORE CALLING THIS IT WILL BREAK
    if (turnScore >= 500 && !canPlay) return setCanPlay(true);

    numPrevDiceHeld.current = numDiceHeld;
  }, [diceValue]);
}

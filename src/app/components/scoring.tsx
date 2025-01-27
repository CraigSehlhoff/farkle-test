"use client";
import { useEffect } from "react";
import { DiceValue } from "../page";
import React from "react";

const calcScore = (diceValue: DiceValue[]) => {
  //counts how many of each die value there are
  const counts = new Array(7).fill(0);

  //creates a new array based on the value of each die
  const values = diceValue.map((d) => d.value);

  values.forEach((v) => counts[v]++);

  let score = 0;

  if (values.length === 6 && counts.slice(1).every((c) => c === 1)) {
    return 1500; // Straight
  }
  if (
    values.length === 6 &&
    counts.slice(1).filter((c) => c === 2).length === 3
  ) {
    return 1500; // Three pairs
  }
  if (
    values.length === 6 &&
    counts.slice(1).filter((c) => c === 3).length === 2
  ) {
    return 2500; // Two triplets
  }
  if (
    values.length === 6 &&
    counts.slice(1).filter((c) => c === 4).length === 1 &&
    counts.slice(1).filter((c) => c === 2).length === 1
  ) {
    return 1500; // Four of a kind and a pair
  }
  if (values.length >= 3 && counts.slice(1).some((c) => c >= 3)) {
    if (counts.slice(1).filter((c) => c === 3).length === 1) {
      return values[0] === 1 ? 300 : values[0] * 100; // Three of a kind
    }
    if (counts.slice(1).filter((c) => c === 4).length === 1) {
      return 1000; // Four of a kind
    }
    if (counts.slice(1).filter((c) => c === 5).length === 1) {
      return 2000; // Five of a kind
    }
    if (counts.slice(1).filter((c) => c === 6).length === 1) {
      return 3000; // Six of a kind
    }
  }
  //you are having an issue with the 3+ of a kind...they are adding to the held dice...for example if you have 3 1s held and then roll another 1 and hold it it is adding 1000 to the score...this is wrong...maybe create a new state for the newly held die so they dont combine?  you can make this reset when the dice are rolled again and then combine the held dice with the newly held dice (if this wouldnt cause the same issue)

  // Add scores for individual dice values (1s and 5s)
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
        // setDiceValue((oldDice) =>
        //   oldDice.map((prevValue) => ({ ...prevValue, held: false }))
        // );
        setFarkle(false);
        // rollDice();
        setKeepRolling(true);
        console.log("new turnscore if 6 held die:", newTurnScore);
      }
    }
    //what is a farkle...it is when you roll and do not have any new scoring die
    // if (
    //   newPossibleRollScore === 0 &&
    //   possibleRollScore === 0 &&
    //   turnScore !== 0
    // ) {
    //   setFarkle(true);
    //   console.log("Farkle!");
    // }
    // console.log("🚀 ~ useEffect ~ possibleRollScore:", possibleRollScore);

    // console.log("🚀 ~ numPrevDiceHeld:", numPrevDiceHeld);
    // console.log("🚀 ~ useEffect ~ newPossibleRollScore:", newPossibleRollScore);
    // console.log("🚀 ~ useEffect ~ numDiceHeld:", numDiceHeld);
    // console.log("🚀 ~ useEffect ~ turnScore:", turnScore);
    // console.log("🚀 ~ useEffect ~ roundScore:", roundScore);
    // console.log("🚀 ~ useEffect ~ keepRolling:", keepRolling);
    // Always update this, at the end of all of this logic.
    //! IF YOU RETURN BEFORE CALLING THIS IT WILL BREAK
    if (turnScore >= 500 && !canPlay) return setCanPlay(true);

    numPrevDiceHeld.current = numDiceHeld;
  }, [diceValue]);
}

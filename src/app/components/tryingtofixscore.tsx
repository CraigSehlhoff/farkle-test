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
  let onesCount = counts[1];
  let fivesCount = counts[5];

  // Check for other combinations first
  if (values.length === 6 && counts.slice(1).every((c) => c === 1)) {
    score += 1500;
    if (values.includes(1)) onesCount -= 1;
    if (values.includes(5)) fivesCount -= 1; // Straight
    console.log("🚀 ~ calcScore ~ values:", values[0]);
  } else if (
    values.length === 6 &&
    counts.slice(1).filter((c) => c === 2).length === 3
  ) {
    score += 1500; // Three pairs
    if (values.includes(1)) onesCount -= 2;
    if (values.includes(5)) fivesCount -= 2;
  } else if (
    values.length === 6 &&
    counts.slice(1).filter((c) => c === 3).length === 2
  ) {
    score += 2500; // Two triplets
    if (values.includes(1)) onesCount -= 3;
    if (values.includes(5)) fivesCount -= 3;
  } else if (
    values.length === 6 &&
    counts.slice(1).filter((c) => c === 4).length === 1 &&
    counts.slice(1).filter((c) => c === 2).length === 1
  ) {
    score += 1500; // Four of a kind and a pair
    if (values.filter((v) => v === 1).length === 4) onesCount -= 4;
    if (values.filter((v) => v === 5).length === 4) fivesCount -= 4;
    if (values.filter((v) => v === 1).length === 2) onesCount -= 2;
    if (values.filter((v) => v === 5).length === 2) fivesCount -= 2;
  } else if (values.length >= 3 && counts.slice(1).some((c) => c >= 3)) {
    if (counts.slice(1).filter((c) => c === 3).length === 1) {
      const threeOfAKindValue = values.find((v) => counts[v] === 3);
      if (threeOfAKindValue !== undefined) score += threeOfAKindValue * 100; // Three of a kind
      if (values.filter((v) => v === 1).length === 3) onesCount -= 3;
      if (values.filter((v) => v === 5).length === 3) fivesCount -= 3;
    } else if (counts.slice(1).filter((c) => c === 4).length === 1) {
      score += 1000; // Four of a kind
      if (values.filter((v) => v === 1).length === 4) onesCount -= 4;
      if (values.filter((v) => v === 5).length === 4) fivesCount -= 4;
    } else if (counts.slice(1).filter((c) => c === 5).length === 1) {
      score += 2000; // Five of a kind
      if (values.filter((v) => v === 1).length === 5) onesCount -= 5;
      if (values.filter((v) => v === 5).length === 5) fivesCount -= 5;
    } else if (counts.slice(1).filter((c) => c === 6).length === 1) {
      score += 3000; // Six of a kind
      if (values.filter((v) => v === 1).length === 6) onesCount -= 6;
      if (values.filter((v) => v === 5).length === 6) fivesCount -= 6;
    }
  }

  // Add scores for individual dice values (1s and 5s) that are not part of any combination
  score += onesCount * 100;
  console.log("🚀 ~ calcScore ~ onesCount:", onesCount);
  score += fivesCount * 50;
  console.log("🚀 ~ calcScore ~ fivesCount:", fivesCount);

  console.log("🚀 ~ calcScore ~ score:", score);
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

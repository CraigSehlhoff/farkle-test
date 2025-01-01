"use client";
import { useEffect } from "react";
import { DiceValue } from "../page";
import React from "react";

const calcScore = (diceValue: DiceValue[]) => {
  let score = 0;
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
  setDiceValue,
  turnScore,
  setTurnScore,
  possibleRollScore,
  setPossibleRollScore,
  farkle,
  setFarkle,
  rollDice,
  keepRolling,
  setKeepRolling
) {
  const numPrevDiceHeld = React.useRef(0);

  const newPossibleRollScore = calcScore(diceValue.filter((die) => !die.held));

  useEffect(() => {
    console.log("USE EFFECT RUNNING");
    const numDiceHeld = diceValue.reduce((acc, curr) => {
      if (curr.held) {
        acc += 1;
      }
      return acc;
    }, 0);
    setPossibleRollScore(newPossibleRollScore);

    //if any dice are held take the score of the held dice and put them into newTurnScore
    if (numDiceHeld >= 0) {
      const newTurnScore = calcScore(diceValue.filter((die) => die.held));
      console.log("🚀 ~ useEffect ~ newTurnScore:", newTurnScore);
      //if keep rolling is true and the number of dice held increases add the newTurnScore to the previous turn score.  If the number of dice held does not increase keep the turn score the same
      const hasDiceHeldIncreased = numDiceHeld > numPrevDiceHeld.current;
      if (keepRolling) {
        setTurnScore(
          (prevScore: number) =>
            prevScore + (hasDiceHeldIncreased ? newTurnScore : 0)
        );

        //if the number of dice held is more than or equal to 0 and keepRolling is true set keepRolling to false
        if (numDiceHeld === 0) {
          // setKeepRolling(false);
          setTurnScore(turnScore);
        }
      }
      //if any dice are held and keepRolling is false set the turn score to the value of the held dice
      if (!keepRolling) {
        setTurnScore(newTurnScore);
      }
      //if the number of dice held is equal to 6, set the turn score to newTurnScore, make all dice live again, roll dice and set keepRolling to true
      if (numDiceHeld === 6) {
        setTurnScore(newTurnScore);
        setDiceValue((oldDice) =>
          oldDice.map((prevValue) => ({ ...prevValue, held: false }))
        );
        setFarkle(false);
        rollDice();
        setKeepRolling(true);
      }
      //if the number of dice held is 0 and keepRolling is true, setTurnScore to turnScore
      // if (numDiceHeld === 0 && keepRolling) {
      //   setTurnScore(turnScore);
      // }
    }

    //if the newPossibleRollScore is 0 and the possibleRollScore is 0 and the turnScore is NOT 0 and there are dice that are live and are not 1 or 5 set farkle to true
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
    console.log("🚀 ~ useEffect ~ keepRolling:", keepRolling);
    // Always update this, at the end of all of this logic.
    //! IF YOU RETURN BEFORE CALLING THIS IT WILL BREAK
    numPrevDiceHeld.current = numDiceHeld;
  }, [diceValue]);
}

"use client";
import { useState } from "react";
import { diceImages, Dice } from "./components/dice";
import { nanoid } from "nanoid";
import useGameScoring from "./components/scoring";
import Image from "next/image";

//what you need to do.
// assign points to each die value
// assign combinations of dice to points
// keep track of score
// not allow a player to play until they reach a score of 500
// make the live dice and held dice separate arrays so that the possible score is only calculated on the live dice....this will help for when the possible score = 0 and there has to be a new turn

//MAKE MORE COMPONENTS...CLEAN THIS SHIT UP

function newDie() {
  return {
    value: Math.floor(Math.random() * 6) + 1,
    held: false,
    id: nanoid(),
  };
}

function allNewDice() {
  const newDice = [];
  for (let i = 0; i < 6; i++) {
    newDice.push(newDie());
  }
  return newDice;
}

export type DiceValue = ReturnType<typeof newDie>;

export default function Home() {
  const [diceValue, setDiceValue] = useState<DiceValue[]>(allNewDice());
  const [possibleRollScore, setPossibleRollScore] = useState(0);
  const [turnScore, setTurnScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [farkle, setFarkle] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [keepRolling, setKeepRolling] = useState(false);

  //check points for scoring (both turn and possible roll score)

  useGameScoring(
    diceValue,
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
  );

  function rollDice() {
    setDiceValue((oldDice) =>
      oldDice.map((prevValue) => (prevValue.held ? { ...prevValue } : newDie()))
    );
  }

  //you can not play until you reach a score of 500, after that score is reached you can start adding the turn score to the total score
  if (turnScore === 500 && !canPlay) return setCanPlay(true);

  function holdDie(id: string) {
    setDiceValue((oldDice) =>
      oldDice.map((prevValue) =>
        prevValue.id === id
          ? { ...prevValue, held: !prevValue.held }
          : prevValue
      )
    );
  }

  function newGame() {
    setDiceValue(allNewDice());
    setGameStarted(true);
    setFarkle(false);
    setTotalScore(0);
    setTurnScore(0);
    setCanPlay(false);
  }

  function setAllDiceToFive() {
    setDiceValue((oldDice) =>
      oldDice.map((prevValue) => ({ ...prevValue, value: 5 }))
    );
  }

  const diceElements = diceValue.map(
    (die) =>
      !die.held && (
        <Dice
          key={die.id}
          holdDie={() => holdDie(die.id)}
          value={die.value}
          held={die.held}
          id={die.id}
        />
      )
  );

  const heldDiceElements = diceValue.map(
    (die) =>
      die.held && (
        <Dice
          key={die.id}
          holdDie={() => holdDie(die.id)}
          value={die.value}
          held={die.held}
          id={die.id}
        />
      )
  );

  function endTurn() {
    if (canPlay) setTotalScore(totalScore + turnScore);
    setDiceValue(allNewDice());
    setFarkle(false);
    setTurnScore(0);
    if (!canPlay) setTurnScore(0);
    setKeepRolling(false);
  }

  return (
    <div>
      <div className="flex flex-col justify-center">
        <h1 className="text-center mt-10">FARKLE!</h1>
        <button
          onClick={newGame}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto mr-auto mt-10"
        >
          New Game
        </button>
        <button
          onClick={setAllDiceToFive}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-auto mr-auto mt-10"
        >
          Set All Dice to 5
        </button>
      </div>
      {!gameStarted && (
        <div className="flex justify-center flex-wrap">
          {diceImages.map((die) => (
            <Image
              key={die}
              src={die}
              width={100}
              height={100}
              alt={`Die ${die}`}
              className={"rounded-xl items-center mt-10"}
            />
          ))}
        </div>
      )}
      {gameStarted && (
        <div>
          <div>
            <div>Possible live die score:{possibleRollScore}</div>
            <div>Score this turn:{turnScore}</div>
            <div>Total Score:{totalScore}</div>
          </div>
          <div className="mt-10 text-center">
            live dice:
            <div className="flex justify-center gap-2 flex-wrap w-3/4 ml-auto mr-auto">
              {diceElements}
            </div>
            {!farkle && (
              <button
                onClick={rollDice}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10"
              >
                Roll Dice
              </button>
            )}
            <button
              onClick={endTurn}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ml-5"
            >
              End Turn
            </button>
            <div>held dice:</div>
            <div className="flex justify-center gap-2 flex-wrap w-3/4 ml-auto mr-auto">
              {heldDiceElements}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

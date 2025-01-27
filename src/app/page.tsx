"use client";
import { useEffect, useState } from "react";
import { diceImages, Dice } from "./components/dice";
import { nanoid } from "nanoid";
import useGameScoring from "./components/scoring";
import Image from "next/image";
import TestingButtons from "./components/testingbuttons";

//what you need to do.

//there will be more bugs...thats alright...you can face that when you get there...but try to finish up the scoring first

//try and stay focused on one task at a time...

//finally make it look a little purdy

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
    setKeepRolling,
    canPlay,
    setCanPlay
  );

  function rollDice() {
    setDiceValue((oldDice) =>
      oldDice.map((prevValue) => (prevValue.held ? { ...prevValue } : newDie()))
    );
    if (diceValue.every((die) => die.held === true)) {
      setDiceValue(allNewDice());
    }
  }

  //you can not play until you reach a score of 500, after that score is reached you can start adding the turn score to the total score

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
    setKeepRolling(false);
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

  console.log("🚀 ~ Home ~ possibleRollScore:", possibleRollScore);
  return (
    <div>
      {possibleRollScore >= 500 && <div>NICE ROLL! You can now play!</div>}
      <div className="flex flex-col justify-center">
        <h1 className="text-center mt-10">FARKLE!</h1>
        <button
          onClick={newGame}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto mr-auto mt-10"
        >
          New Game
        </button>
        <TestingButtons setDiceValue={setDiceValue} />
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
          {totalScore <= 10000 ? (
            <div className="mt-10 text-center">
              live dice:
              <div className="flex justify-center gap-2 flex-wrap w-3/4 ml-auto mr-auto">
                {diceElements}
              </div>
              {!farkle && diceValue.some((die) => die.held) && (
                <button
                  onClick={rollDice}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10"
                >
                  Roll Dice
                </button>
              )}
              {diceValue.some((die) => die.held) && !farkle && canPlay && (
                <button
                  onClick={endTurn}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ml-5"
                >
                  End Turn
                </button>
              )}
              {diceValue.some((die) => die.held) && farkle && (
                <div>
                  FARKLE!
                  <button
                    onClick={newGame}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto mr-auto mt-10"
                  >
                    New Game
                  </button>
                </div>
              )}
              <div>held dice:</div>
              <div className="flex justify-center gap-2 flex-wrap w-3/4 ml-auto mr-auto">
                {heldDiceElements}
              </div>
            </div>
          ) : (
            <div>You Win!!! Your score is {totalScore}!!!</div>
          )}
        </div>
      )}
    </div>
  );
}

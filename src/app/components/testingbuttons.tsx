type DiceValue = {
  value: number;
};

type TestingButtonsProps = {
  setDiceValue: React.Dispatch<React.SetStateAction<DiceValue[]>>;
};

export default function TestingButtons({ setDiceValue }: TestingButtonsProps) {
  function setAllDiceToFive() {
    setDiceValue((oldDice) =>
      oldDice.map((prevValue) => ({ ...prevValue, value: 5 }))
    );
  }

  function setDiceToStraight() {
    const straightValues = [1, 2, 3, 4, 5, 6];
    setDiceValue((oldDice) =>
      oldDice.map((prevValue, index) => ({
        ...prevValue,
        value: straightValues[index % straightValues.length],
      }))
    );
  }

  function setDiceToThreePairs() {
    const threePairsValues = [1, 1, 2, 2, 3, 3];
    setDiceValue((oldDice) =>
      oldDice.map((prevValue, index) => ({
        ...prevValue,
        value: threePairsValues[index % threePairsValues.length],
      }))
    );
  }

  function setDiceToTwoTriplets() {
    const twoTripletsValues = [1, 1, 1, 2, 2, 2];
    setDiceValue((oldDice) =>
      oldDice.map((prevValue, index) => ({
        ...prevValue,
        value: twoTripletsValues[index % twoTripletsValues.length],
      }))
    );
  }

  function setDiceToFourOfAKindAndAPair() {
    const fourOfAKindAndAPairValues = [1, 1, 1, 1, 5, 5];
    setDiceValue((oldDice) =>
      oldDice.map((prevValue, index) => ({
        ...prevValue,
        value:
          fourOfAKindAndAPairValues[index % fourOfAKindAndAPairValues.length],
      }))
    );
  }
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={setAllDiceToFive}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-auto mr-auto mt-4"
      >
        Set All Dice to 5
      </button>
      <button
        onClick={setDiceToStraight}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-auto mr-auto mt-4"
      >
        Set Dice to Straight
      </button>
      <button
        onClick={setDiceToThreePairs}
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded ml-auto mr-auto mt-4"
      >
        Set Dice to Three Pairs
      </button>
      <button
        onClick={setDiceToTwoTriplets}
        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded ml-auto mr-auto mt-4"
      >
        Set Dice to Two Triplets
      </button>
      <button
        onClick={setDiceToFourOfAKindAndAPair}
        className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded ml-auto mr-auto mt-4"
      >
        Set Dice to Four of a Kind and a Pair
      </button>
    </div>
  );
}

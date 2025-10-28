class Dice {
  static roll(): DiceRoll {
    const d1 = Math.ceil(Math.random() * 6) as DiceValue;
    const d2 = Math.ceil(Math.random() * 6) as DiceValue;
    return [d1, d2];
  }
}

export default Dice;
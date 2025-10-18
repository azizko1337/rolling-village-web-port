class Dice {
  roll() {
    const d1 = Math.ceil(Math.random() * 6);
    const d2 = Math.ceil(Math.random() * 6);
    return [d1, d2];
  }
}

export default Dice;
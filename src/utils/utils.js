import { gameTrainingData } from "../constants/trainingData";

export const generateGameObjects = (baseYear, basePrice) => {
  const trainingData = [];

  for (let i = 0; i < gameTrainingData.length; i++) {
    const year = baseYear + Math.random() * 10;
    const priceFluctuation =
      (Math.random() < 0.5 ? -1 : 1) * 0.25 * Math.random();
    const price = basePrice * (1 + priceFluctuation);
    const randomIndex = Math.floor(Math.random() * gameTrainingData.length);
    const {
      genre_Adventure,
      genre_RPG,
      genre_Simulation,
      genre_Strategy,
      genre_Sports,
      genre_Puzzle,
      platform_Console,
      platform_PC,
    } = gameTrainingData[randomIndex].input;

    trainingData.push({
      input: {
        year: year * 0.0001,
        genre_Adventure,
        genre_RPG,
        genre_Simulation,
        genre_Strategy,
        genre_Sports,
        genre_Puzzle,
        platform_Console,
        platform_PC,
      },
      output: { price: price * 0.001 },
    });
  }

  return trainingData;
};

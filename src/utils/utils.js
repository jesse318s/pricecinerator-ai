import { yearNormalizationFactor } from "../App";

// Filters out the year from the random training data
const filterRandomData = (randomTrainingData) => {
  return Object.keys(randomTrainingData).reduce((acc, key) => {
    if (key !== "year") acc[key] = randomTrainingData[key];

    return acc;
  }, {});
};

// Generates additional training data for the neural network based on the initial training data
export const generateTrainingObjects = (
  baseYear,
  basePrice,
  trainingData,
  priceModifier
) => {
  const randomYearRange = 10;
  const priceFluctuationFactor = 0.25;
  const newTrainingData = [];

  for (let i = 0; i < trainingData.length; i++) {
    const randomYear = baseYear + Math.random() * randomYearRange;
    const priceFluctuation =
      (Math.random() < 0.5 ? -1 : 1) * priceFluctuationFactor * Math.random();
    const randomPrice = basePrice * (1 + priceFluctuation);
    const randomIndex = Math.floor(Math.random() * trainingData.length);
    const randomTrainingData = trainingData[randomIndex].input;
    const filteredRandomData = filterRandomData(randomTrainingData);
    const input = {
      year: randomYear * yearNormalizationFactor,
      ...filteredRandomData,
    };

    newTrainingData.push({
      input,
      output: {
        price: randomPrice / priceModifier,
      },
    });
  }

  return newTrainingData;
};

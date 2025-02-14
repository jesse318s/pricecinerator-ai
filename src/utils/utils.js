import { yearNormalizationFactor } from "../App";

// Validates a binary property of an object
export const validateBinaryProperty = (key, val) => {
  if (val === null)
    throw new Error('Value for key "' + key + '" cannot be null.');

  if (val === undefined)
    throw new Error('Value for key "' + key + '" cannot be undefined.');

  if (typeof val !== "number")
    throw new Error('Value for key "' + key + '" must be a number.');

  if (isNaN(val))
    throw new Error('`Value for key "' + key + '" cannot be NaN.');

  if (!isFinite(val))
    throw new Error(
      'Value for key "' + key + '" cannot be Infinity or -Infinity.'
    );

  if (val !== 0 && val !== 1)
    throw new Error('Value for key "' + key + '" must be either 0 or 1.');
};

// Filters the random training data object to remove the year property
const filterRandomTrainingData = (randomTrainingData) => {
  return Object.keys(randomTrainingData).reduce((acc, key) => {
    const val = randomTrainingData[key];

    if (key !== "year") {
      acc[key] = val;
      validateBinaryProperty(key, val);
    }

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
    const filteredRandomData = filterRandomTrainingData(randomTrainingData);
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

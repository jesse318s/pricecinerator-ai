export const generateTrainingObjects = (baseYear, basePrice, trainingData) => {
  const newTrainingData = [];

  for (let i = 0; i < trainingData.length; i++) {
    const randomYear = baseYear + Math.random() * 10;
    const priceFluctuation =
      (Math.random() < 0.5 ? -1 : 1) * 0.25 * Math.random();
    const randomPrice = basePrice * (1 + priceFluctuation);
    const randomIndex = Math.floor(Math.random() * trainingData.length);
    const randomTrainingData = trainingData[randomIndex].input;

    const filteredRandomData = Object.keys(randomTrainingData).reduce(
      (acc, key) => {
        if (key !== "year" && key !== "price") {
          acc[key] = randomTrainingData[key];
        }

        return acc;
      },
      {}
    );

    const input = {
      year: randomYear * 0.0001,
      ...filteredRandomData,
    };

    newTrainingData.push({
      input,
      output: { price: randomPrice * 0.001 },
    });
  }

  return newTrainingData;
};

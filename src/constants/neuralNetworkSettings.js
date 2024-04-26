export const neuralNetworkTypes = { game: "game" }; // Types of neural networks available

export const neuralNetworkYearRanges = {
  game: { min: 1977, max: 2999 },
}; // The min and max year allowed for user input

export const neuralNetworkPriceModifiers = {
  game: 1000,
}; // Multiplier for the price prediction output

export const gameNeuralNetworkConfig = {
  hiddenLayers: [5, 5], // Number of neurons in each hidden layer
  inputSize: 10, // Number of input neurons (features)
  outputSize: 1, // Number of output neurons (predictions)
  hiddenLayerActivation: "relu", // Activation function for the hidden layer neurons
  reluAlpha: 0.005, // Slope of the activation function for the hidden layer neurons
};

export const gameTrainingOptions = {
  iterations: 100000, // The maximum times to iterate the training data
  timeout: 30000, // Maximum training time in milliseconds
  learningRate: 0.9, // The learning rate, how much to change the weights at each iteration
  decayRate: 0.9, // The learning rate decay over time
  momentum: 0.05, // How much to let previous iterations influence the current one
  errorThresh: 0.00001, // Error threshold to reach before completing the training
  minimize: true, // Whether to minimize or maximize the error function
  log: true, // Whether to console.log() progress periodically
  logPeriod: 10000, // How many iterations between logging
  callbackPeriod: 100000, // How many iterations between calling the callback
  callback: null, // Function to call at each callbackPeriod
};

export const gameObjectGenerationOptions = {
  lowBaseYear: 1977, // The earliest year for the generated objects
  lowBasePrice: 39, // The price for lowBaseYear
  medBaseYear: 2000, // The middle year for the generated objects
  medBasePrice: 49, // The price for medBaseYear
  highBaseYear: 2030, // The latest year for the generated objects
  highBasePrice: 69, // The price for highBaseYear
};

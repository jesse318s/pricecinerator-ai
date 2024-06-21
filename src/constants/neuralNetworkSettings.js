export const neuralNetworkTimeoutDelay = 200; // Delay in ms before running the neural network

export const neuralNetworkTypes = {
  game: "game",
  bitcoin: "bitcoin",
}; // Types of neural networks available

export const neuralNetworkYearRanges = {
  game: { min: 1977, max: 2999 },
  bitcoin: { min: 2024, max: 2199 },
}; // The min and max year allowed for user input

export const neuralNetworkPriceModifiers = {
  game: 1000,
  bitcoin: 10000000,
}; // Multiplier for the price prediction output

export const gameNeuralNetworkConfig = {
  hiddenLayers: [5, 5], // Number of neurons in each hidden layer
  inputSize: 10, // Number of input neurons (features)
  outputSize: 1, // Number of output neurons (predictions)
  hiddenLayerActivation: "relu", // Activation function for the hidden layer neurons
};

export const gameTrainingOptions = {
  iterations: 100000, // The maximum times to iterate the training data
  timeout: 37000, // Maximum training time in milliseconds
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

export const bitcoinNeuralNetworkConfig = {
  hiddenLayers: [2], // Number of neurons in each hidden layer
  inputSize: 1, // Number of input neurons (features)
  outputSize: 1, // Number of output neurons (predictions)
  hiddenLayerActivation: "relu", // Activation function for the hidden layer neurons
};

export const bitcoinTrainingOptions = {
  iterations: 150000, // The maximum times to iterate the training data
  timeout: 56000, // Maximum training time in milliseconds
  learningRate: 0.4, // The learning rate, how much to change the weights at each iteration
  decayRate: 0.1, // The learning rate decay over time
  momentum: 0.9, // How much to let previous iterations influence the current one
  errorThresh: 0.00001, // Error threshold to reach before completing the training
  minimize: true, // Whether to minimize or maximize the error function
  log: true, // Whether to console.log() progress periodically
  logPeriod: 15000, // How many iterations between logging
  callbackPeriod: 150000, // How many iterations between calling the callback
  callback: null, // Function to call at each callbackPeriod
};

export const bitcoinObjectGenerationOptions = {
  lowBaseYear: 2015, // The earliest year for the generated objects
  lowBasePrice: 320, // The price for lowBaseYear
  medBaseYear: 2019, // The medium year for the generated objects
  medBasePrice: 4024, // The price for medBaseYear
  medHighBaseYear: 2024, // The medium-high year for the generated objects
  medHighBasePrice: 73000, // The price for medhighBaseYear
  highBaseYear: 2034, // The latest year for the generated objects
  highBasePrice: 219000, // The price for highBaseYear
};

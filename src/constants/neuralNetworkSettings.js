//----------------------
// Global Settings
//----------------------
export const neuralNetworkTimeoutDelay = 200; // Delay in ms before running the neural network

export const neuralNetworkTypes = {
  game: "game",
  bitcoin: "bitcoin",
  exampleNetwork: "exampleNetwork",
}; // Types of neural networks available

export const neuralNetworkYearRanges = {
  game: { min: 1977, max: 2999 },
  bitcoin: { min: 2024, max: 2199 },
  exampleNetwork: { min: 2025, max: 2026 },
}; // The min and max year allowed for user input

export const neuralNetworkPriceModifiers = {
  game: 1000,
  bitcoin: 10000000,
  exampleNetwork: 1000,
}; // Multiplier for the price prediction output

//----------------------
// Game Neural Network Settings
//----------------------
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

export const gameObjectGenerationOptions = new Map([
  [1977, 39], // The earliest year and price for the generated objects
  [2000, 49], // The middle year and price for the generated objects
  [2030, 69], // The latest year and price for the generated objects
]);

//----------------------
// Bitcoin Neural Network Settings
//----------------------
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

export const bitcoinObjectGenerationOptions = new Map([
  [2015, 320], // The earliest year and price for the generated objects
  [2019, 4024], // The medium year and price for the generated objects
  [2024, 73000], // The medium-high year and price for the generated objects
  [2034, 219000], // The latest year and price for the generated objects
]);

//----------------------
// Example Network Neural Network Settings
//----------------------
export const exampleNetworkNeuralNetworkConfig = {
  hiddenLayers: [3], // Number of neurons in each hidden layer
  inputSize: 1, // Number of input neurons (features)
  outputSize: 1, // Number of output neurons (predictions)
  hiddenLayerActivation: "relu", // Activation function for the hidden layer neurons
};

export const exampleNetworkTrainingOptions = {
  iterations: 50000, // The maximum times to iterate the training data
  timeout: 30000, // Maximum training time in milliseconds
  learningRate: 0.5, // The learning rate, how much to change the weights at each iteration
  decayRate: 0.1, // The learning rate decay over time
  momentum: 0.1, // How much to let previous iterations influence the current one
  errorThresh: 0.0001, // Error threshold to reach before completing the training
  minimize: true, // Whether to minimize or maximize the error function
  log: true, // Whether to console.log() progress periodically
  logPeriod: 5000, // How many iterations between logging
  callbackPeriod: 50000, // How many iterations between calling the callback
  callback: null, // Function to call at each callbackPeriod
};

export const exampleNetworkObjectGenerationOptions = new Map([
  [2025, 100], // The earliest year and price for the generated objects
  [2026, 200], // The latest year and price for the generated objects
]);

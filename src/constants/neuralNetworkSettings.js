export const neuralNetworkConfig = {
  hiddenLayers: [5, 5], // Number of neurons in each hidden layer
  inputSize: 10, // Number of input neurons (features)
  outputSize: 1, // Number of output neurons (predictions)
  hiddenLayerActivation: "relu", // Activation function for the hidden layer neurons
  reluAlpha: 0.005, // Slope of the activation function for the hidden layer neurons
  outputLayerActivation: "linear", // Activation function for the output layer neurons
};

export const gameObjectGenerationOptions = {
  lowBaseYear: 1977, // Base year for past games
  lowBasePrice: 39, // Base price for past games
  medBaseYear: 2000, // Base year for recent games
  medBasePrice: 49, // Base price for recent games
  highBaseYear: 2030, // Base year for future games
  highBasePrice: 69, // Base price for future games
};

export const neuralNetworkTrainingOptions = {
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
};

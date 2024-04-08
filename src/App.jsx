import "./App.css";
import { useState } from "react";
import { trainingData } from "./constants/trainingData";
import * as brain from "brain.js";

const originalTrainingDataLength = trainingData.length;
const neuralNetworkConfig = {
  hiddenLayers: [5, 5], // Number of neurons in each hidden layer (e.g., [5, 5] means two hidden layers with 5 neurons each
  inputSize: 10, // Number of input neurons (e.g., for 10 features like game genre, platform, year of release, etc.)
  outputSize: 1, // Number of output neurons (e.g., for predicting a single price)
  hiddenLayerActivation: "relu", // Activation function for the hidden layer neurons
  reluAlpha: 0.005, // Slope of the activation function for the hidden layer neurons
  outputLayerActivation: "linear", // Activation function for the output layer neurons
};
const neuralNetworkTrainingOptions = {
  iterations: 100000, // The maximum times to iterate the training data
  timeout: 30000, // Maximum training time in milliseconds
  learningRate: 0.9, // This is a multiplier that determines how much to adjust the weights of your network with respect the loss gradient during each step of your training. A higher learning rate means the model will learn faster, but it may also overshoot the optimal solution.
  decayRate: 0.9, // This is a multiplier that is used to decrease the learning rate over time (or over epochs). This is done to ensure that the learning rate doesn't stay too high for too long, which could cause the model to miss the optimal solution.
  momentum: 0.05, // This is a multiplier that takes into account the previous changes in the weights to accelerate learning in the right direction, thus leading to faster convergence.
  errorThresh: 0.00001, // Error threshold to reach before completing the training
  minimize: true, // Whether to minimize or maximize the error function
  log: true, // Whether to console.log() progress periodically
  logPeriod: 10000, // How many iterations between logging
};
let trainingDataIsLoaded = false;
export let neuralNetwork;

const generateGameObjects = (numGames, baseYear, basePrice) => {
  try {
    for (let i = 0; i < numGames; i++) {
      const year = baseYear + Math.random() * 10;
      const priceFluctuation =
        (Math.random() < 0.5 ? -1 : 1) * 0.25 * Math.random();
      const price = basePrice * (1 + priceFluctuation);
      const randomIndex = Math.floor(
        Math.random() * originalTrainingDataLength
      );
      const {
        genre_Adventure,
        genre_RPG,
        genre_Simulation,
        genre_Strategy,
        genre_Sports,
        genre_Puzzle,
        platform_Console,
        platform_PC,
      } = trainingData[randomIndex].input;

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
  } catch (err) {
    console.error(err);
  }
};

function App() {
  const [yearInput, setYearInput] = useState(1977);
  const [priceOutput, setPriceOutput] = useState(0);
  const [priceOutputIsLoading, setPriceOutputIsLoading] = useState(false);

  const runNeuralNetwork = () => {
    try {
      const gameInput = {
        year: yearInput / 10000,
        genre_Action: document.getElementById("genre_Action").checked ? 1 : 0,
        genre_Adventure: document.getElementById("genre_Adventure").checked
          ? 1
          : 0,
        genre_RPG: document.getElementById("genre_RPG").checked ? 1 : 0,
        genre_Simulation: document.getElementById("genre_Simulation").checked
          ? 1
          : 0,
        genre_Strategy: document.getElementById("genre_Strategy").checked
          ? 1
          : 0,
        genre_Sports: document.getElementById("genre_Sports").checked ? 1 : 0,
        genre_Puzzle: document.getElementById("genre_Puzzle").checked ? 1 : 0,
        platform_Console: document.getElementById("platform_Console").checked
          ? 1
          : 0,
        platform_PC: document.getElementById("platform_PC").checked ? 1 : 0,
      };
      let predictionResult;

      if (trainingDataIsLoaded)
        trainingData.length = originalTrainingDataLength;

      generateGameObjects(originalTrainingDataLength, 1977, 39);
      generateGameObjects(originalTrainingDataLength, 2000, 49);
      generateGameObjects(originalTrainingDataLength, 2030, 69);
      trainingDataIsLoaded = true;
      console.log(trainingData);
      neuralNetwork = new brain.NeuralNetwork(neuralNetworkConfig);
      neuralNetwork.train(trainingData, neuralNetworkTrainingOptions);
      predictionResult = neuralNetwork.run(gameInput);
      return predictionResult["price"];
    } catch (err) {
      console.error(err);
    }
  };

  const predictPrice = () => {
    try {
      if (yearInput < 1977) setYearInput(1977);

      setPriceOutputIsLoading(true);
      setTimeout(() => {
        setPriceOutput((1000 * runNeuralNetwork()).toFixed(2));
        setPriceOutputIsLoading(false);
      }, 0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="panel">
        <form>
          <div className="box">
            <label htmlFor="year">Year:</label>
            <input
              type="number"
              id="year"
              name="year"
              value={yearInput}
              onChange={(e) => setYearInput(e.target.value)}
            />
          </div>

          <div className="box">
            <label htmlFor="genre_Action">Action:</label>
            <input type="checkbox" id="genre_Action" name="genre_Action" />

            <label htmlFor="genre_Adventure">Adventure:</label>
            <input
              type="checkbox"
              id="genre_Adventure"
              name="genre_Adventure"
            />

            <label htmlFor="genre_RPG">RPG:</label>
            <input type="checkbox" id="genre_RPG" name="genre_RPG" />

            <label htmlFor="genre_Simulation">Simulation:</label>
            <input
              type="checkbox"
              id="genre_Simulation"
              name="genre_Simulation"
            />

            <label htmlFor="genre_Strategy">Strategy:</label>
            <input type="checkbox" id="genre_Strategy" name="genre_Strategy" />

            <label htmlFor="genre_Sports">Sports:</label>
            <input type="checkbox" id="genre_Sports" name="genre_Sports" />

            <label htmlFor="genre_Puzzle">Puzzle:</label>
            <input type="checkbox" id="genre_Puzzle" name="genre_Puzzle" />
          </div>

          <div className="box">
            <label htmlFor="platform_Console">Console:</label>
            <input
              type="checkbox"
              id="platform_Console"
              name="platform_Console"
            />

            <label htmlFor="platform_PC">PC:</label>
            <input type="checkbox" id="platform_PC" name="platform_PC" />
          </div>
        </form>

        {priceOutputIsLoading ? (
          <>
            <div className="loader"></div>
          </>
        ) : (
          <>
            <button onClick={() => predictPrice()}>Predict Price</button>
            <p>Price: ${priceOutput}</p>
          </>
        )}
      </div>
    </>
  );
}

export default App;

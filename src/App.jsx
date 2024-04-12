import "./App.css";
import { useState } from "react";
import { trainingData } from "./constants/trainingData";
import * as brain from "brain.js";
import { serializedNeuralNetwork } from "./constants/serializedNeuralNetwork";

const originalTrainingDataLength = trainingData.length;
const neuralNetworkConfig = {
  hiddenLayers: [5, 5], // Number of neurons in each hidden layer
  inputSize: 10, // Number of input neurons (features)
  outputSize: 1, // Number of output neurons (predictions)
  hiddenLayerActivation: "relu", // Activation function for the hidden layer neurons
  reluAlpha: 0.005, // Slope of the activation function for the hidden layer neurons
  outputLayerActivation: "linear", // Activation function for the output layer neurons
};
const neuralNetworkTrainingOptions = {
  iterations: 100000, // The maximum times to iterate the training data
  timeout: 30000, // Maximum training time in milliseconds
  learningRate: 0.9, // The learning rate, how much to change the weights at each iteration
  decayRate: 0.9, // The learning rate decay over time
  momentum: 0.05, // How much to let previous iterations influence the current one
  errorThresh: 0.00001, // Error threshold to reach before completing the training
  minimize: true, // Whether to minimize or maximize the error function
  log: true, // Whether to console.log() progress periodically
  logPeriod: 10000, // How many iterations between logging
  callback: () => (trainingIsIncomplete = false), // Callback for iterations
  callbackPeriod: 100000, // How many iterations between calling the callback
};
let trainingIsIncomplete = false;
let trainingDataIsLoaded = false;
export let neuralNetwork;

const handlePerformance = (gameInput) => {
  try {
    const predictionResult = serializedNeuralNetwork.run(gameInput);

    trainingIsIncomplete = false;

    return predictionResult["price"];
  } catch (err) {
    console.error(err);
  }
};

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
  const [serializedNeuralNetworkText, setSerializedNeuralNetworkText] =
    useState("");

  const handleTraining = (neuralNetwork) => {
    try {
      const newNeuralNetwork = neuralNetwork.toFunction();

      setSerializedNeuralNetworkText(newNeuralNetwork.toString());

      if (
        confirm(
          "TRAINING COMPLETE - Would you like to save this model for use in Performance Mode? (It'll be lost on refresh)"
        )
      )
        serializedNeuralNetwork.run = newNeuralNetwork;
    } catch (err) {
      console.error(err);
    }
  };

  const runNeuralNetwork = (predictionYear) => {
    try {
      const gameInput = {
        year: predictionYear / 10000,
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

      if (document.getElementById("performance_Mode").checked)
        return handlePerformance(gameInput);

      if (trainingDataIsLoaded)
        trainingData.length = originalTrainingDataLength;

      generateGameObjects(originalTrainingDataLength, 1977, 39);
      generateGameObjects(originalTrainingDataLength, 2000, 49);
      generateGameObjects(originalTrainingDataLength, 2030, 69);
      trainingDataIsLoaded = true;
      console.log(trainingData);
      neuralNetwork = new brain.NeuralNetwork(neuralNetworkConfig);
      neuralNetwork.train(trainingData, neuralNetworkTrainingOptions);

      if (
        document.getElementById("training_Mode").checked &&
        !trainingIsIncomplete
      )
        handleTraining(neuralNetwork);

      predictionResult = neuralNetwork.run(gameInput);
      return predictionResult["price"];
    } catch (err) {
      console.error(err);
    }
  };

  const predictPrice = () => {
    try {
      let predictionYear = yearInput;

      if (predictionYear < 1977) {
        predictionYear = 1977;
        setYearInput(1977);
      }

      trainingIsIncomplete = true;
      setPriceOutputIsLoading(true);
      setSerializedNeuralNetworkText("");

      setTimeout(() => {
        setPriceOutput((1000 * runNeuralNetwork(predictionYear)).toFixed(2));

        if (trainingIsIncomplete)
          alert("TRAINING INCOMPLETE - Performance mode is recommended.");

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
            <h3>Game Input</h3>

            <div className="box_row">
              <label htmlFor="year">Year:</label>
              <input
                type="number"
                id="year"
                name="year"
                value={yearInput}
                onChange={(e) => setYearInput(e.target.value)}
              />
            </div>

            <div className="box_row">
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
              <input
                type="checkbox"
                id="genre_Strategy"
                name="genre_Strategy"
              />

              <label htmlFor="genre_Sports">Sports:</label>
              <input type="checkbox" id="genre_Sports" name="genre_Sports" />

              <label htmlFor="genre_Puzzle">Puzzle:</label>
              <input type="checkbox" id="genre_Puzzle" name="genre_Puzzle" />
            </div>

            <div className="box_row">
              <label htmlFor="platform_Console">Console:</label>
              <input
                type="checkbox"
                id="platform_Console"
                name="platform_Console"
              />

              <label htmlFor="platform_PC">PC:</label>
              <input type="checkbox" id="platform_PC" name="platform_PC" />
            </div>
          </div>

          <div className="box">
            <h3>Prediction Options</h3>

            <div className="box_row">
              <label htmlFor="performance_Mode">Performance Mode:</label>
              <input
                type="radio"
                id="performance_Mode"
                name="mode"
                defaultChecked
              />

              <label htmlFor="training_Mode">Training Mode:</label>
              <input type="radio" id="training_Mode" name="mode" />
            </div>
          </div>
        </form>

        {priceOutputIsLoading ? (
          <>
            <div className="loader"></div>
          </>
        ) : (
          <>
            <button onClick={() => predictPrice()}>Predict Price</button>
            <h3>Price: ${priceOutput}</h3>
          </>
        )}

        {!trainingIsIncomplete && serializedNeuralNetworkText ? (
          <>
            <div className="sized_box">
              <h3>Serialized neural network text:</h3>
              {serializedNeuralNetworkText}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export default App;

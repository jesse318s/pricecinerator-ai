import "./App.css";
import { useState, useRef, useEffect } from "react";
import { trainingData as originalTrainingData } from "./constants/trainingData";
import { serializedNeuralNetwork as originalSerializedNeuralNetwork } from "./constants/serializedNeuralNetwork";
import GameInput from "./components/GameInput";
import { gameObjectGenerationOptions } from "./utils/utils";
import { generateGameObjects } from "./utils/utils";
import * as brain from "brain.js";
import {
  neuralNetworkConfig,
  neuralNetworkTrainingOptions,
} from "./constants/neuralNetworkSettings";

function App() {
  const [gameInput, setGameInput] = useState({
    year: gameObjectGenerationOptions.lowBaseYear,
  });
  const [predictionOptions, setPredictionOptions] = useState({
    performanceMode: true,
    trainingMode: false,
  });
  const [priceOutputIsLoading, setPriceOutputIsLoading] = useState(false);
  const [priceOutput, setPriceOutput] = useState(0);
  const [errMsgTxt, setErrMsgTxt] = useState("");
  const [serializedNeuralNetwork, setSerializedNeuralNetwork] = useState(
    originalSerializedNeuralNetwork
  );
  const [serializedNeuralNetworkText, setSerializedNeuralNetworkText] =
    useState("");
  const trainingIsIncomplete = useRef(false);
  const trainingData = originalTrainingData.slice();

  useEffect(
    () =>
      (neuralNetworkTrainingOptions.callback = () =>
        (trainingIsIncomplete.current = false)),
    []
  );

  const handlePerformance = (gameInputFormatted) => {
    try {
      const predictionResult = serializedNeuralNetwork.run(gameInputFormatted);

      trainingIsIncomplete.current = false;
      return predictionResult["price"];
    } catch (err) {
      console.error(err);
      setErrMsgTxt(err.message);
    }
  };

  const handleTraining = (neuralNetwork) => {
    try {
      const newNeuralNetwork = neuralNetwork.toFunction();

      setSerializedNeuralNetworkText(newNeuralNetwork.toString());

      if (
        confirm(
          "TRAINING COMPLETE - Would you like to save this model for use in Performance Mode?" +
            " (It'll be lost on refresh)"
        )
      )
        setSerializedNeuralNetwork({ run: newNeuralNetwork });
    } catch (err) {
      console.error(err);
      setErrMsgTxt(err.message);
    }
  };

  const runNeuralNetwork = (predictionYear) => {
    try {
      const gameInputFormatted = {
        year: predictionYear / 10000,
        genre_Action: gameInput.genre_Action ? 1 : 0,
        genre_Adventure: gameInput.genre_Adventure ? 1 : 0,
        genre_RPG: gameInput.genre_RPG ? 1 : 0,
        genre_Simulation: gameInput.genre_Simulation ? 1 : 0,
        genre_Strategy: gameInput.genre_Strategy ? 1 : 0,
        genre_Sports: gameInput.genre_Sports ? 1 : 0,
        genre_Puzzle: gameInput.genre_Puzzle ? 1 : 0,
        platform_Console: gameInput.platform_Console ? 1 : 0,
        platform_PC: gameInput.platform_PC ? 1 : 0,
      };
      const optionsKeys = Object.keys(gameObjectGenerationOptions);

      if (predictionOptions.performanceMode)
        return handlePerformance(gameInputFormatted);

      trainingData.length = originalTrainingData.length;

      for (let i = 0; i < optionsKeys.length / 2; i++) {
        const newTrainingData = generateGameObjects(
          gameObjectGenerationOptions[optionsKeys[i * 2]],
          gameObjectGenerationOptions[optionsKeys[i * 2 + 1]]
        );

        trainingData.splice(trainingData.length, 0, ...newTrainingData);
      }

      const neuralNetwork = new brain.NeuralNetwork(neuralNetworkConfig);

      neuralNetwork.train(trainingData, neuralNetworkTrainingOptions);

      if (predictionOptions.trainingMode && !trainingIsIncomplete.current)
        handleTraining(neuralNetwork);

      const predictionResult = neuralNetwork.run(gameInputFormatted);

      return predictionResult["price"];
    } catch (err) {
      console.error(err);
      setErrMsgTxt(err.message);
    }
  };

  const predictPrice = () => {
    try {
      let predictionYear = gameInput.year;

      setErrMsgTxt("");

      if (gameInput.year < gameObjectGenerationOptions.lowBaseYear) {
        predictionYear = gameObjectGenerationOptions.lowBaseYear;
        setGameInput({
          ...gameInput,
          year: gameObjectGenerationOptions.lowBaseYear,
        });
      }

      trainingIsIncomplete.current = true;
      setPriceOutputIsLoading(true);
      setSerializedNeuralNetworkText("");

      setTimeout(() => {
        setPriceOutput((1000 * runNeuralNetwork(predictionYear)).toFixed(2));

        if (trainingIsIncomplete.current)
          alert("TRAINING INCOMPLETE - Performance mode is recommended.");

        setPriceOutputIsLoading(false);
      }, 100);
    } catch (err) {
      console.error(err);
      setErrMsgTxt(err.message);
    }
  };

  return (
    <>
      <div className="panel">
        <GameInput
          gameInput={gameInput}
          setGameInput={setGameInput}
          predictionOptions={predictionOptions}
          setPredictionOptions={setPredictionOptions}
        />

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

        {errMsgTxt ? (
          <>
            <div className="sized_box">
              <h3>Error:</h3>
              {errMsgTxt}
            </div>
          </>
        ) : null}

        {!trainingIsIncomplete.current && serializedNeuralNetworkText ? (
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

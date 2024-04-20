import "./App.css";
import { useState, useRef } from "react";
import { gameObjectGenerationOptions as originalObjectGenerationOptions } from "./utils/utils";
import {
  gameNeuralNetworkConfig as originalNeuralNetworkConfig,
  gameTrainingOptions as originalNetworkTrainingOptions,
} from "./constants/neuralNetworkSettings";
import { gameSerializedNeuralNetwork as originalSerializedNeuralNetwork } from "./constants/serializedNeuralNetworks";
import { gameTrainingData as originalTrainingData } from "./constants/trainingData";
import { generateGameObjects as generateOriginalObjects } from "./utils/utils";
import GameInput from "./components/GameInput";
import * as brain from "brain.js";

function App() {
  const [predictionObjectInput, setPredictionObjectInput] = useState({
    year: new Date().getFullYear(),
  });
  const [predictionOptions, setPredictionOptions] = useState({
    performanceMode: true,
    trainingMode: false,
  });
  const [priceOutput, setPriceOutput] = useState("?");
  const [errMsgTxt, setErrMsgTxt] = useState("");
  const [trainingText, setTrainingText] = useState("");
  const trainingIsIncomplete = useRef(false);
  const objectGenerationOptions = useRef(originalObjectGenerationOptions);
  const neuralNetworkTrainingOptions = useRef(originalNetworkTrainingOptions);
  const serializedNeuralNetwork = useRef(originalSerializedNeuralNetwork);
  const neuralNetworkConfig = useRef(originalNeuralNetworkConfig);
  const generatePredictionObjects = useRef(generateOriginalObjects);
  const trainingData = useRef(originalTrainingData.slice());

  const trainNeuralNetwork = () => {
    try {
      const optionsKeys = Object.keys(objectGenerationOptions.current);
      const neuralNetwork = new brain.NeuralNetwork(
        neuralNetworkConfig.current
      );
      const trainingDataInitialLength = trainingData.current.length;

      for (let i = 0; i < optionsKeys.length / 2; i++) {
        const newTrainingData = generatePredictionObjects.current(
          objectGenerationOptions.current[optionsKeys[i * 2]],
          objectGenerationOptions.current[optionsKeys[i * 2 + 1]]
        );

        trainingData.current.splice(
          trainingData.current.length,
          0,
          ...newTrainingData
        );
      }

      neuralNetwork.train(
        trainingData.current,
        neuralNetworkTrainingOptions.current
      );
      trainingData.current.length = trainingDataInitialLength;

      return neuralNetwork;
    } catch (err) {
      console.error(err);
      setErrMsgTxt(err.message);
    }
  };

  const runNeuralNetwork = () => {
    try {
      const year =
        predictionObjectInput.year < objectGenerationOptions.current.lowBaseYear
          ? objectGenerationOptions.current.lowBaseYear
          : predictionObjectInput.year;
      const predictionObjectInputFormatted = {
        year: year / 10000,
      };

      for (const key in predictionObjectInput) {
        if (key.includes("genre") || key.includes("platform"))
          predictionObjectInputFormatted[key] = predictionObjectInput[key]
            ? 1
            : 0;
      }

      setTrainingText("");

      if (predictionOptions.performanceMode) {
        const price =
          1000 *
          serializedNeuralNetwork.current.run(predictionObjectInputFormatted)[
            "price"
          ];

        setPriceOutput(price.toFixed(2));

        return;
      }

      trainingIsIncomplete.current = true;

      const neuralNetwork = trainNeuralNetwork(year);

      setTrainingText(
        "Your device may not be performant enough for Training Mode. Your training wasn't saved."
      );

      if (trainingIsIncomplete.current) {
        const price =
          1000 *
          serializedNeuralNetwork.current.run(predictionObjectInputFormatted)[
            "price"
          ];

        setPriceOutput(price.toFixed(2));

        return;
      }

      serializedNeuralNetwork.current = {
        run: neuralNetwork.toFunction(),
      };

      const newSerializedNeuralNetwork = neuralNetwork.toFunction().toString();

      setTrainingText(newSerializedNeuralNetwork);

      const price =
        1000 * neuralNetwork.run(predictionObjectInputFormatted)["price"];

      setPriceOutput(price.toFixed(2));
    } catch (err) {
      console.error(err);
      setErrMsgTxt(err.message);
    }
  };

  const predictPrice = () => {
    try {
      setErrMsgTxt("");

      if (
        predictionObjectInput.year < objectGenerationOptions.current.lowBaseYear
      )
        setPredictionObjectInput({
          ...predictionObjectInput,
          year: objectGenerationOptions.current.lowBaseYear,
        });

      setPriceOutput(undefined);

      neuralNetworkTrainingOptions.current.callback = () => {
        trainingIsIncomplete.current = false;
      };

      setTimeout(runNeuralNetwork, 200);
    } catch (err) {
      console.error(err);
      setErrMsgTxt(err.message);
    }
  };

  return (
    <>
      <div className="panel">
        <GameInput
          predictionObjectInput={predictionObjectInput}
          setPredictionObjectInput={setPredictionObjectInput}
          predictionOptions={predictionOptions}
          setPredictionOptions={setPredictionOptions}
        />

        {!priceOutput ? (
          <>
            <div className="loader"></div>
          </>
        ) : (
          <>
            <button onClick={predictPrice}>Predict Price</button>
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

        {trainingText ? (
          <>
            <div className="sized_box">
              <h3>Training Data:</h3>
              {trainingText}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export default App;

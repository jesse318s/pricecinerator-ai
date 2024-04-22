import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import {
  gameNeuralNetworkConfig as originalNeuralNetworkConfig,
  gameTrainingOptions as originalNetworkTrainingOptions,
  gameObjectGenerationOptions as originalObjectGenerationOptions,
} from "./constants/neuralNetworkSettings";
import { gameSerializedNeuralNetwork as originalSerializedNeuralNetwork } from "./constants/serializedNeuralNetworks";
import { gameTrainingData as originalTrainingData } from "./constants/trainingData";
import { generateTrainingObjects } from "./utils/utils";
import GameInput from "./components/GameInput";
import * as brain from "brain.js";

const neuralNetworkTypes = { game: "game" };
const neuralNetworkComps = { game: GameInput };

function App() {
  const [predictionObjectInput, setPredictionObjectInput] = useState({
    year: new Date().getFullYear().toString(),
  });
  const [predictionOptions, setPredictionOptions] = useState({
    performanceMode: true,
    trainingMode: false,
  });
  const [priceOutput, setPriceOutput] = useState("?");
  const [errMsgTxt, setErrMsgTxt] = useState("");
  const [trainingText, setTrainingText] = useState("");
  const [neuralNetworkType, setNeuralNetworkType] = useState(
    neuralNetworkTypes.game
  );
  const trainingIsIncomplete = useRef(false);
  const objectGenerationOptions = useRef(originalObjectGenerationOptions);
  const neuralNetworkTrainingOptions = useRef(originalNetworkTrainingOptions);
  const serializedNeuralNetwork = useRef(originalSerializedNeuralNetwork);
  const neuralNetworkConfig = useRef(originalNeuralNetworkConfig);
  const trainingData = useRef(originalTrainingData.slice());

  const displayNeuralNetworkComp = () => {
    switch (neuralNetworkType) {
      case neuralNetworkTypes.game:
        objectGenerationOptions.current = originalObjectGenerationOptions;
        neuralNetworkTrainingOptions.current = originalNetworkTrainingOptions;
        serializedNeuralNetwork.current = originalSerializedNeuralNetwork;
        neuralNetworkConfig.current = originalNeuralNetworkConfig;
        trainingData.current = originalTrainingData.slice();
        break;
    }

    setPredictionObjectInput({
      year: new Date().getFullYear().toString(),
    });
    setPredictionOptions({
      performanceMode: true,
      trainingMode: false,
    });
    setPriceOutput("?");
    setErrMsgTxt("");
    setTrainingText("");
  };

  const trainNeuralNetwork = () => {
    try {
      const optionsKeys = Object.keys(objectGenerationOptions.current);
      const neuralNetwork = new brain.NeuralNetwork(
        neuralNetworkConfig.current
      );
      const trainingDataInitialLength = trainingData.current.length;

      for (let i = 0; i < optionsKeys.length / 2; i++) {
        const newTrainingData = generateTrainingObjects(
          objectGenerationOptions.current[optionsKeys[i * 2]],
          objectGenerationOptions.current[optionsKeys[i * 2 + 1]],
          trainingData.current
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

      console.log(trainingData.current);

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
        if (key !== "year")
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
          year: objectGenerationOptions.current.lowBaseYear.toString(),
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

  useEffect(displayNeuralNetworkComp, [neuralNetworkType]);

  return (
    <>
      <div className="panel">
        <div className="menu">
          {Object.keys(neuralNetworkTypes).map((type) => (
            <button
              key={type}
              onClick={() => {
                setNeuralNetworkType(type);
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {neuralNetworkComps[neuralNetworkType] ? (
          <>
            {React.createElement(neuralNetworkComps[neuralNetworkType], {
              predictionObjectInput: predictionObjectInput,
              setPredictionObjectInput: setPredictionObjectInput,
              predictionOptions: predictionOptions,
              setPredictionOptions: setPredictionOptions,
            })}
          </>
        ) : null}

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

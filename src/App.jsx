import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import * as neuralNetworkSettings from "./constants/neuralNetworkSettings";
import { useNeuralNetwork } from "./hooks/useNeuralNetwork";
import LandingPage from "./components/LandingPage";
import PredictionInput from "./components/PredictionInput";

function App() {
  const [errMsgTxt, setErrMsgTxt] = useState("");
  const [isLpVisible, setIsLpVisible] = useState(true);
  const [predictionObjectInput, setPredictionObjectInput] = useState({
    year: new Date().getFullYear().toString(),
  });
  const [predictionOptions, setPredictionOptions] = useState({
    performanceMode: true,
    trainingMode: false,
  });
  const [neuralNetworkType, setNeuralNetworkType] = useState(
    neuralNetworkSettings.neuralNetworkTypes.game
  );
  const [priceOutput, setPriceOutput] = useState("?");
  const [nnStatusTxt, setNnStatusTxt] = useState("");
  const neuralNetworkTimeout = useRef(0);
  const {
    trainingIsIncomplete,
    serializedNeuralNetwork,
    neuralNetworkYearRange,
    priceModifier,
    trainNeuralNetwork,
  } = useNeuralNetwork(
    setErrMsgTxt,
    neuralNetworkType,
    setPredictionObjectInput,
    setPriceOutput,
    setNnStatusTxt
  );

  const continueToApp = () => setIsLpVisible(false);

  // Ensures the year input is within neural network's range and updates state if it's adjusted
  const validateYear = () => {
    const { min, max } = neuralNetworkYearRange.current;
    const year = parseFloat(predictionObjectInput.year);
    const validatedYear = Math.max(min, Math.min(max, year));

    if (year !== validatedYear) {
      setPredictionObjectInput({
        ...predictionObjectInput,
        year: validatedYear,
      });
      setNnStatusTxt(
        "Year must be between " +
          neuralNetworkYearRange.current.min +
          " and " +
          neuralNetworkYearRange.current.max +
          "."
      );
    }

    return validatedYear;
  };

  /*
  The runNeuralNetwork function is responsible for running the neural network to predict the price
  based on the input.

  In Performance Mode, the function uses the pre-trained neural network to predict the price.

  In Training Mode, the function:
  - Saves a newly trained neural network for use in Performance Mode
  - Uses the newly trained neural network to predict the price
  */
  const runNeuralNetwork = () => {
    try {
      const predictionObjectInputFormatted = {
        year: validateYear() / 10000,
      };

      for (const key in predictionObjectInput) {
        if (key !== "year")
          predictionObjectInputFormatted[key] = predictionObjectInput[key]
            ? 1
            : 0;
      }

      if (predictionOptions.performanceMode) {
        const price =
          priceModifier.current *
          serializedNeuralNetwork.current.run(predictionObjectInputFormatted)[
            "price"
          ];

        setPriceOutput(price.toFixed(2));

        return;
      }

      trainingIsIncomplete.current = true;

      const neuralNetwork = trainNeuralNetwork(year);

      setNnStatusTxt(
        "Your device may not be performant enough for Training Mode. Your training wasn't used."
      );

      if (trainingIsIncomplete.current) {
        const price =
          priceModifier.current *
          serializedNeuralNetwork.current.run(predictionObjectInputFormatted)[
            "price"
          ];

        setPriceOutput(price.toFixed(2));

        return;
      }

      serializedNeuralNetwork.current.run = neuralNetwork.toFunction();

      const newSerializedNeuralNetwork = neuralNetwork.toFunction().toString();

      setNnStatusTxt(newSerializedNeuralNetwork);

      const price =
        priceModifier.current *
        neuralNetwork.run(predictionObjectInputFormatted)["price"];

      setPriceOutput(price.toFixed(2));
    } catch (err) {
      console.error(err);
      setErrMsgTxt("An error occurred while running the neural network.");
    }
  };

  // Resets output and error state, then schedules the neural network to run after 200ms
  const predictPrice = () => {
    setErrMsgTxt("");
    setPriceOutput("");
    setNnStatusTxt("");
    clearTimeout(neuralNetworkTimeout.current);
    neuralNetworkTimeout.current = setTimeout(runNeuralNetwork, 200);
  };

  useEffect(() => {
    // Clears the neural network timeout when the component unmounts
    return clearTimeout(neuralNetworkTimeout.current);
  }, []);

  if (errMsgTxt)
    return (
      <div className="panel">
        <div className="sized-box">{errMsgTxt}</div>
        <button onClick={() => window.location.reload(true)}>Refresh</button>
      </div>
    );

  if (isLpVisible) return <LandingPage continueToApp={continueToApp} />;

  return (
    <>
      <div className="panel">
        <div className="menu">
          {/* Generates buttons based on the keys in the neuralNetworkTypes object */}
          {Object.keys(neuralNetworkSettings.neuralNetworkTypes).map((type) => (
            <button key={type} onClick={() => setNeuralNetworkType(type)}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
          <button onClick={() => setIsLpVisible(true)}>Help</button>
        </div>

        <PredictionInput
          neuralNetworkType={neuralNetworkType}
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

        {nnStatusTxt ? (
          <>
            <div className="sized-box">
              <h3>Neural Network Status:</h3>
              {nnStatusTxt}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export default App;

import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import * as neuralNetworkSettings from "./constants/neuralNetworkSettings";
import { useNeuralNetwork } from "./hooks/useNeuralNetwork";
import ErrorPanel from "./components/ErrorPanel";
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
      setNnStatusTxt(`Year must be between ${min} and ${max}.`);
    }

    return validatedYear;
  };

  // Uses the pre-trained neural network to predict the price
  const runPerformanceMode = (predictionObjectInputFormatted) => {
    try {
      const price =
        priceModifier.current *
        serializedNeuralNetwork.current.run(predictionObjectInputFormatted)[
          "price"
        ];

      setPriceOutput(price.toFixed(2));
    } catch (err) {
      console.error(err);
      setErrMsgTxt(
        "An error occurred while running the neural network in Performance Mode."
      );
    }
  };

  /* 
    - Trains a new neural network based on the input year
    - Saves the newly trained neural network for use in Performance Mode
    - Uses the newly trained neural network to predict the price
    - (Runs the neural network in Performance Mode instead, if the training doesn't complete)
  */
  const runTrainingMode = (predictionObjectInputFormatted) => {
    try {
      trainingIsIncomplete.current = true;

      const neuralNetwork = trainNeuralNetwork(
        predictionObjectInputFormatted.year
      );

      setNnStatusTxt(
        "Your device may not be performant enough for Training Mode. Your training wasn't used."
      );

      if (trainingIsIncomplete.current) {
        runPerformanceMode(predictionObjectInputFormatted);
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
      setErrMsgTxt(
        "An error occurred while running the neural network in Training Mode."
      );
    }
  };

  // Runs the neural network to predict the price based on the input
  const runNeuralNetwork = () => {
    const predictionObjectInputFormatted = {
      year: validateYear() / neuralNetworkSettings.yearNormalizationFactor,
    };

    for (const key in predictionObjectInput) {
      if (key !== "year")
        predictionObjectInputFormatted[key] = predictionObjectInput[key]
          ? 1
          : 0;
    }

    if (predictionOptions.performanceMode) {
      runPerformanceMode(predictionObjectInputFormatted);
      return;
    }

    runTrainingMode(predictionObjectInputFormatted);
  };

  // Resets output and error state, then schedules the neural network to run after a delay
  const predictPrice = () => {
    setErrMsgTxt("");
    setPriceOutput("");
    setNnStatusTxt("");
    clearTimeout(neuralNetworkTimeout.current);
    neuralNetworkTimeout.current = setTimeout(
      runNeuralNetwork,
      neuralNetworkSettings.neuralNetworkTimeoutDelay
    );
  };

  useEffect(() => {
    // Clears the neural network timeout when the component unmounts
    return clearTimeout(neuralNetworkTimeout.current);
  }, []);

  if (errMsgTxt) return <ErrorPanel errMsgTxt={errMsgTxt} />;

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

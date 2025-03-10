import { useRef, useEffect } from "react";
import * as neuralNetworkSettings from "../constants/neuralNetworkSettings";
import * as serializedNeuralNetworks from "../constants/serializedNeuralNetworks";
import * as neuralNetworkTrainingData from "../constants/trainingData";
import * as brain from "brain.js";
import {
  validateBinaryProperty,
  generateTrainingObjects,
} from "../utils/utils";

export function useNeuralNetwork(
  setErrMsgTxt,
  neuralNetworkType,
  setPredictionObjectInput,
  setPriceOutput,
  setNnStatusTxt
) {
  const neuralNetworkConfig = useRef(
    neuralNetworkSettings.gameNeuralNetworkConfig
  );
  const neuralNetworkTrainingOptions = useRef(
    neuralNetworkSettings.gameTrainingOptions
  );
  const trainingStatusRef = useRef(false);
  const objectGenerationOptions = useRef(
    neuralNetworkSettings.gameObjectGenerationOptions
  );
  const serializedNeuralNetwork = useRef(
    serializedNeuralNetworks.gameSerializedNeuralNetwork
  );
  const trainingData = useRef(
    neuralNetworkTrainingData.gameTrainingData.slice()
  );
  const neuralNetworkYearRange = useRef(
    neuralNetworkSettings.neuralNetworkYearRanges[neuralNetworkType]
  );
  const priceModifier = useRef(
    neuralNetworkSettings.neuralNetworkPriceModifiers[neuralNetworkType]
  );

  const updateTrainingStatus = (status) => (trainingStatusRef.current = status);

  // Loads the neural network based on the selected type
  const loadNeuralNetwork = () => {
    try {
      neuralNetworkConfig.current =
        neuralNetworkSettings[`${neuralNetworkType}NeuralNetworkConfig`];
      neuralNetworkTrainingOptions.current =
        neuralNetworkSettings[`${neuralNetworkType}TrainingOptions`];
      neuralNetworkTrainingOptions.current.callback = () =>
        (trainingStatusRef.current = false);
      objectGenerationOptions.current =
        neuralNetworkSettings[`${neuralNetworkType}ObjectGenerationOptions`];
      serializedNeuralNetwork.current =
        serializedNeuralNetworks[`${neuralNetworkType}SerializedNeuralNetwork`];
      trainingData.current =
        neuralNetworkTrainingData[`${neuralNetworkType}TrainingData`];
      neuralNetworkYearRange.current =
        neuralNetworkSettings.neuralNetworkYearRanges[neuralNetworkType];
      priceModifier.current =
        neuralNetworkSettings.neuralNetworkPriceModifiers[neuralNetworkType];
      setPredictionObjectInput({
        year: new Date().getFullYear().toString(),
      });
      setErrMsgTxt("");
      setPriceOutput("?");
      setNnStatusTxt("");
    } catch (err) {
      console.error(err);
      setErrMsgTxt("An error occurred while loading the neural network.");
    }
  };

  // Generates a new neural network and trains it based on the training data and options
  const trainNeuralNetwork = () => {
    try {
      const neuralNetwork = new brain.NeuralNetwork(
        neuralNetworkConfig.current
      );
      const trainingDataInitialLength = trainingData.current.length;

      trainingData.current.forEach(({ input }) => {
        Object.keys(input).forEach((key) => {
          const val = input[key];

          if (key !== "year") validateBinaryProperty(key, val);
        });
      });

      for (const [key, value] of objectGenerationOptions.current) {
        const newTrainingData = generateTrainingObjects(
          key,
          value,
          trainingData.current,
          priceModifier.current
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
      setErrMsgTxt("An error occurred while training the neural network.");
    }
  };

  // Runs when the component mounts and whenever the neuralNetworkType changes
  useEffect(loadNeuralNetwork, [
    neuralNetworkType,
    setErrMsgTxt,
    setPredictionObjectInput,
    setPriceOutput,
    setNnStatusTxt,
  ]);

  return {
    trainingStatusRef,
    updateTrainingStatus,
    serializedNeuralNetwork,
    neuralNetworkYearRange,
    priceModifier,
    trainNeuralNetwork,
  };
}

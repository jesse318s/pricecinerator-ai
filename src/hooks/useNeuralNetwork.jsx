import { useRef, useEffect } from "react";
import * as neuralNetworkSettings from "../constants/neuralNetworkSettings";
import * as serializedNeuralNetworks from "../constants/serializedNeuralNetworks";
import * as neuralNetworkTrainingData from "../constants/trainingData";
import * as brain from "brain.js";
import { generateTrainingObjects } from "../utils/utils";

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
  const trainingIsIncomplete = useRef(false);
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

  // Loads the neural network based on the selected type
  const loadNeuralNetwork = () => {
    try {
      neuralNetworkConfig.current =
        neuralNetworkSettings[`${neuralNetworkType}NeuralNetworkConfig`];
      neuralNetworkTrainingOptions.current =
        neuralNetworkSettings[`${neuralNetworkType}TrainingOptions`];
      neuralNetworkTrainingOptions.current.callback = () =>
        (trainingIsIncomplete.current = false);
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
      const optionsKeys = Object.keys(objectGenerationOptions.current);
      const neuralNetwork = new brain.NeuralNetwork(
        neuralNetworkConfig.current
      );
      const trainingDataInitialLength = trainingData.current.length;

      for (let i = 0; i < optionsKeys.length / 2; i++) {
        if (!optionsKeys) break;

        const newTrainingData = generateTrainingObjects(
          objectGenerationOptions.current[optionsKeys[i * 2]],
          objectGenerationOptions.current[optionsKeys[i * 2 + 1]],
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
  useEffect(loadNeuralNetwork, [neuralNetworkType]);

  return {
    trainingIsIncomplete,
    serializedNeuralNetwork,
    neuralNetworkYearRange,
    priceModifier,
    trainNeuralNetwork,
  };
}

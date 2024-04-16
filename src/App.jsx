import "./App.css";
import { useState, useRef, useEffect } from "react";
import { trainingData as originalTrainingData } from "./constants/trainingData";
import {
  neuralNetworkConfig,
  gameObjectGenerationOptions,
  neuralNetworkTrainingOptions,
} from "./constants/neuralNetworkSettings";
import { serializedNeuralNetwork as originalSerializedNeuralNetwork } from "./constants/serializedNeuralNetwork";
import * as brain from "brain.js";

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
  const trainingDataIsLoaded = useRef(false);
  const trainingData = originalTrainingData.slice();

  useEffect(() => {
    neuralNetworkTrainingOptions.callback = () =>
      (trainingIsIncomplete.current = false);
  }, []);

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

  const generateGameObjects = (baseYear, basePrice) => {
    try {
      for (let i = 0; i < originalTrainingData.length; i++) {
        const year = baseYear + Math.random() * 10;
        const priceFluctuation =
          (Math.random() < 0.5 ? -1 : 1) * 0.25 * Math.random();
        const price = basePrice * (1 + priceFluctuation);
        const randomIndex = Math.floor(
          Math.random() * originalTrainingData.length
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
        genre_Action: 0,
        genre_Adventure: gameInput.genre_Adventure ? 1 : 0,
        genre_RPG: gameInput.genre_RPG ? 1 : 0,
        genre_Simulation: gameInput.genre_Simulation ? 1 : 0,
        genre_Strategy: gameInput.genre_Strategy ? 1 : 0,
        genre_Sports: gameInput.genre_Sports ? 1 : 0,
        genre_Puzzle: gameInput.genre_Puzzle ? 1 : 0,
        platform_Console: gameInput.platform_Console ? 1 : 0,
        platform_PC: gameInput.platform_PC ? 1 : 0,
      };

      if (predictionOptions.performanceMode)
        return handlePerformance(gameInputFormatted);

      if (trainingDataIsLoaded.current)
        trainingData.length = originalTrainingData.length;

      generateGameObjects(
        gameObjectGenerationOptions.lowBaseYear,
        gameObjectGenerationOptions.lowBasePrice
      );
      generateGameObjects(
        gameObjectGenerationOptions.medBaseYear,
        gameObjectGenerationOptions.medBasePrice
      );
      generateGameObjects(
        gameObjectGenerationOptions.highBaseYear,
        gameObjectGenerationOptions.highBasePrice
      );
      trainingDataIsLoaded.current = true;
      console.log(trainingData);

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
        <form>
          <div className="box">
            <h3>Game Input</h3>

            <div className="box_row">
              <label htmlFor="year">Year:</label>
              <input
                type="number"
                id="year"
                name="year"
                value={gameInput.year}
                onChange={(e) =>
                  setGameInput({ ...gameInput, year: e.target.value })
                }
              />
            </div>

            <div className="box_row">
              <label htmlFor="genre_Action">Action:</label>
              <input
                type="checkbox"
                id="genre_Action"
                name="genre_Action"
                onChange={(e) =>
                  setGameInput({ ...gameInput, genre_Action: e.target.checked })
                }
              />

              <label htmlFor="genre_Adventure">Adventure:</label>
              <input
                type="checkbox"
                id="genre_Adventure"
                name="genre_Adventure"
                onChange={(e) =>
                  setGameInput({
                    ...gameInput,
                    genre_Adventure: e.target.checked,
                  })
                }
              />

              <label htmlFor="genre_RPG">RPG:</label>
              <input
                type="checkbox"
                id="genre_RPG"
                name="genre_RPG"
                onChange={(e) =>
                  setGameInput({ ...gameInput, genre_RPG: e.target.checked })
                }
              />

              <label htmlFor="genre_Simulation">Simulation:</label>
              <input
                type="checkbox"
                id="genre_Simulation"
                name="genre_Simulation"
                onChange={(e) =>
                  setGameInput({
                    ...gameInput,
                    genre_Simulation: e.target.checked,
                  })
                }
              />

              <label htmlFor="genre_Strategy">Strategy:</label>
              <input
                type="checkbox"
                id="genre_Strategy"
                name="genre_Strategy"
                onChange={(e) =>
                  setGameInput({
                    ...gameInput,
                    genre_Strategy: e.target.checked,
                  })
                }
              />

              <label htmlFor="genre_Sports">Sports:</label>
              <input
                type="checkbox"
                id="genre_Sports"
                name="genre_Sports"
                onChange={(e) =>
                  setGameInput({ ...gameInput, genre_Sports: e.target.checked })
                }
              />

              <label htmlFor="genre_Puzzle">Puzzle:</label>
              <input
                type="checkbox"
                id="genre_Puzzle"
                name="genre_Puzzle"
                onChange={(e) =>
                  setGameInput({ ...gameInput, genre_Puzzle: e.target.checked })
                }
              />
            </div>

            <div className="box_row">
              <label htmlFor="platform_Console">Console:</label>
              <input
                type="checkbox"
                id="platform_Console"
                name="platform_Console"
                onChange={(e) =>
                  setGameInput({
                    ...gameInput,
                    platform_Console: e.target.checked,
                  })
                }
              />

              <label htmlFor="platform_PC">PC:</label>
              <input
                type="checkbox"
                id="platform_PC"
                name="platform_PC"
                onChange={(e) =>
                  setGameInput({ ...gameInput, platform_PC: e.target.checked })
                }
              />
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
                value={predictionOptions.performanceMode}
                defaultChecked
                onChange={(e) =>
                  setPredictionOptions({
                    ...predictionOptions,
                    performanceMode: e.target.checked,
                    trainingMode: !e.target.checked,
                  })
                }
              />

              <label htmlFor="training_Mode">Training Mode:</label>
              <input
                type="radio"
                id="training_Mode"
                name="mode"
                value={predictionOptions.trainingMode}
                onChange={(e) =>
                  setPredictionOptions({
                    ...predictionOptions,
                    performanceMode: !e.target.checked,
                    trainingMode: e.target.checked,
                  })
                }
              />
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

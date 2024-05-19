import * as trainingData from "../constants/trainingData.js";

function PredictionInput({
  neuralNetworkType,
  predictionObjectInput,
  setPredictionObjectInput,
  predictionOptions,
  setPredictionOptions,
}) {
  return (
    <>
      <form>
        <div className="box">
          <h3>
            {neuralNetworkType.charAt(0).toUpperCase() +
              neuralNetworkType.slice(1) +
              " "}
            Input
          </h3>

          <div className="box-row">
            <label htmlFor="year">
              Year:
              <input
                type="number"
                id="year"
                name="year"
                value={predictionObjectInput.year}
                onChange={(e) =>
                  setPredictionObjectInput({
                    ...predictionObjectInput,
                    year: e.target.value,
                  })
                }
              />
            </label>
          </div>

          <div className="box-row">
            {/* Generates checkboxes for each input key in the training data that isn't "year" */}
            {Object.keys(
              trainingData[neuralNetworkType + "TrainingData"][0].input
            ).map((key) =>
              key !== "year" ? (
                <label key={key} htmlFor={key}>
                  {key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/_/g, " ")}
                  :
                  <input
                    type="checkbox"
                    id={key}
                    name={key}
                    onChange={(e) =>
                      setPredictionObjectInput({
                        ...predictionObjectInput,
                        [key]: e.target.checked,
                      })
                    }
                  />
                </label>
              ) : null
            )}
          </div>
        </div>

        <div className="box">
          <h3>Prediction Options</h3>

          <div className="box-row">
            <label htmlFor="performance-mode">
              Performance Mode:
              <input
                type="radio"
                id="performance-mode"
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
            </label>

            <label htmlFor="training-mode">
              Training Mode:
              <input
                type="radio"
                id="training-mode"
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
            </label>
          </div>
        </div>
      </form>
    </>
  );
}

export default PredictionInput;

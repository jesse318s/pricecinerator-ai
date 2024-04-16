function GameInput({
  gameInput,
  setGameInput,
  predictionOptions,
  setPredictionOptions,
}) {
  return (
    <>
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
    </>
  );
}

export default GameInput;

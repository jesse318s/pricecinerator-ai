# pricecinerator-ai

This app is for predicting prices and developing neural networks for predicting prices. It was created using React.js and the Brain.js library. It was developed in Visual Studio Code.

## Adding a New Neural Network (Development)

1. Add the new training data to the trainingData.js file in the constants folder (as a new export)
2. Add the new serialized neural network, as an empty object, to the serializedNeuralNetwork.js file in the constants folder (as a new export)
3. Add the new neural network settings to the neuralNetworkSettings.js file in the constants folder (some will be new exports)
4. Start the app by using the "npm run dev" command
5. Train the new neural network via Training Mode once you're running the app (you may need to adjust the values to prevent errors)
6. Add the resulting function as the "run" property value of the new serialized neural network in the serializedNeuralNetwork.js file in the constants folder (This is used to run the neural network in Performance Mode)

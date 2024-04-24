# pricecinerator-ai

This app is for predicting prices. It was created using React.js and the Brain.js library. It was developed in Visual Studio Code.

## Adding a New Neural Network (Development)

1. Add the new training data to the trainingData.js file in the constants folder (as a new export)
2. Add the new serialized neural network, as an empty object, to the serializedNeuralNetwork.js file in the constants folder (as a new export)
3. Add the new neural network settings to the neuralNetworkSettings.js file in the constants folder (some will be new exports)
4. Create the new neural network input component along with its test
5. Import the new neural network input component into the App component, and add the new neural network input component to the neuralNetworkComps variable in the App component
6. Start the app by using the "npm run dev" command
7. Train the new neural network via the running app (you may need to adjust the values to prevent training errors)
8. Add the resulting function as an arrow function for the "run" property of the new serialized neural network in the serializedNeuralNetwork.js file in the constants folder

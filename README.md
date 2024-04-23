# pricecinerator-ai

This app is for predicting prices. It was created using React.js and the Brain.js library. It was developed in Visual Studio Code.

## Adding a New Neural Network

1. Add the new training data to the trainingData.js file in the constants folder (as a new export)
2. Add the new serialized neural network, with an empty arrow function for the run property, to the serializedNeuralNetwork.js file in the constants folder (as a new export)
3. Add the new neural network settings to the neuralNetworkSettings.js file in the constants folder (some will be new exports)
4. Create the new neural network input component along with its test
5. Import the new training data, serialized neural network, neural network settings, and neural network input component to the App component, and add the new neural network input component to the neuralNetworkComps variable in the App component
6. Add the code for the new neural network to the displayNeuralNetwork function in the App component (as a new case in the switch statement)
7. Start the app by using the "npm run dev" command
8. Train the new neural network via the running app (you may need to adjust the values to prevent training errors), and then add the resulting function as an arrow function for the run property of the new serialized neural network in the serializedNeuralNetwork.js file in the constants folder

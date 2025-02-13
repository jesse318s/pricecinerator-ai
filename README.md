# pricecinerator-ai

This app is for predicting prices and developing neural networks for predicting prices. It was created using React.js and the Brain.js library. It was developed in Visual Studio Code.

## Adding a New Neural Network (Development)

1. Add the new training data (having an input year and an output price) to the trainingData.js file in the constants folder as "*networkName*TrainingData" (All data must be normalized between 0 and 1 inclusive, with all inputs that aren't the input year always being either 0 or 1)
2. Add the new serialized neural network, with an empty object for its value, to the serializedNeuralNetwork.js file in the constants folder as "*networkName*SerializedNeuralNetwork"
3. Add the new neural network settings to the neuralNetworkSettings.js file in the constants folder as "*networkName*NeuralNetworkConfig", "*networkName*TrainingOptions", and "*networkName*ObjectGenerationOptions". Be sure to properly update all settings in the file. This includes updating the neural network types, neural network year ranges, and neural network price modifiers. Also be sure to add object generation options for the new neural network. (The object generation options are allowed to be an empty Map)
4. Start the app by using the "npm run dev" command
5. Train the new neural network via Training Mode once you're running the app (You may need to adjust the values for your settings or training data, or increase/decrease your training data, to prevent errors)
6. Add the resulting function as the "run" property value of the new serialized neural network in the serializedNeuralNetwork.js file in the constants folder. It can then be used to run the neural network in Performance Mode (If you'd like faster testing of new nueral networks, you may temporarily add the line of code "serializedNeuralNetwork.current.run = neuralNetwork.toFunction();" to the end of the runTrainingMode function in the App.jsx file to automate the process of updating the "run" property for Performance Mode)

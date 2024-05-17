function LandingPage({ continueToApp }) {
  return (
    <div className="panel">
      <div className="box">
        <div className="box-row">
          <h3>Welcome to the Pricecinerator price prediction application!</h3>
          <p>
            This application utilizes a neural network to forecast product
            prices, taking into account the product's year and attributes.
          </p>
        </div>
      </div>

      <ol className="box">
        <li>
          Select the neural network type for your product by clicking the
          corresponding button.
        </li>
        <li>Enter the product's year in the input field.</li>
        <li>Choose any specific product attributes using the checkboxes.</li>
        <li>Click "Predict Price" to see the estimated price.</li>
      </ol>

      <p className="box">
        You can also use Training Mode to train a new neural network version for
        use in Performance Mode. Note: this will be lost on refresh.
      </p>

      <button onClick={continueToApp}>Continue</button>
    </div>
  );
}

export default LandingPage;

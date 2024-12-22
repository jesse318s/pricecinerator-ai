import React from "react";

function ErrorPanel({ errMsgTxt }) {
  return (
    <div className="panel">
      <h3>⚠️</h3>
      <div className="sized-box">{errMsgTxt}</div>
      <button onClick={() => window.location.reload(true)}>Refresh</button>
    </div>
  );
}

export default ErrorPanel;

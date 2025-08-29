import React from "react";

const MonthButton = ({ name, highlighted, onClick }) => (
  <button
    className={`month-button ${highlighted ? "highlighted" : ""}`}
    onClick={onClick}
  >
    {name}
  </button>
);

export default MonthButton;

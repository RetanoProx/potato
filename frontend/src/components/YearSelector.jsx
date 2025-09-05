import React from "react";
import { useNavigate } from "react-router-dom";

const YearSelector = ({ year, setYear }) => {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 9; // последние 10 лет: [currentYear-9 ... currentYear]

  const prevDisabled = year <= minYear;
  const nextDisabled = year >= currentYear;

  const prevYear = () => {
    if (!prevDisabled) setYear(year - 1);
  };

  const nextYear = () => {
    if (!nextDisabled) setYear(year + 1);
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/timer");
  };

  return (
    <div className="year-selector">
      <div className="center-content">
        <button
          onClick={prevYear}
          disabled={prevDisabled}
          aria-label="Предыдущий год"
        >
          ←
        </button>
        <span>{year}</span>
        <button
          onClick={nextYear}
          disabled={nextDisabled}
          aria-label="Следующий год"
        >
          →
        </button>
        <button onClick={handleBack} className="back-button" aria-label="Назад к таймеру">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="black"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="13" r="8"></circle>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="15" y1="13" x2="12" y2="13"></line>
    <line x1="9" y1="2" x2="15" y2="2"></line>
    <line x1="12" y1="2" x2="12" y2="5"></line>
  </svg>
</button>

      </div>
    </div>
  );
};

export default YearSelector;

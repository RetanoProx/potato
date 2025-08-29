import React from "react";

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

  return (
    <div className="year-selector">
      <button onClick={prevYear} disabled={prevDisabled} aria-label="Предыдущий год">←</button>
      <span>{year}</span>
      <button onClick={nextYear} disabled={nextDisabled} aria-label="Следующий год">→</button>
    </div>
  );
};

export default YearSelector;

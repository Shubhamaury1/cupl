import React from "react";
import styles from "./ButtonsContainer.module.css";

function ButtonsContainer({ onButtonClick }) {
  const buttonName = [
    "+",
    "1",
    "2",
    "3",
    "-",
    "4",
    "5",
    "6",
    "*",
    "7",
    "8",
    "9",
    "/",
    "=",
    "0",
    "C",
    ".",
  ];
  return (
    <div className={styles.buttonsContainer}>
      {buttonName.map((buttonNames) => (
        <button
          key={buttonNames}
          className={styles.button}
          onClick={() => onButtonClick(buttonNames)}
        >
          {buttonNames}
        </button>
      ))}
    </div>
  );
}

export default ButtonsContainer;

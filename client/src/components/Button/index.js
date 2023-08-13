import React from "react";
import styles from "./button.module.css";

function Button({ type, disabled, text, onClick, theme, additionalClasses }) {
  const buttonClasses = `${styles.customButton} ${
    theme === "dark" ? styles.dark : styles.light
  } ${additionalClasses || ""}`;

  return (
    <>
      <button
        className={buttonClasses}
        type={type || "button"}
        disabled={disabled || false}
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
}

export default Button;

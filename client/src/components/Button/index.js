import React from "react";
import styles from "./button.module.css";

function Button({ type, disabled, text, onClick }) {
  return (
    <>
      <button
        className={styles.customButton}
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

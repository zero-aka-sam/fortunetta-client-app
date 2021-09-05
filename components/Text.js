import React from "react";

const Text = (props) => {
  const {
    component,
    children,
    variant,
    fontSize,
    lineHeight,
    style,
    fontWeight,
    onClick,
  } = props;

  const primaryStyles = {
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: fontSize || "16px",
    lineHeight: lineHeight || "26px",
    letterSpacing: "0.03em",
    color: "#FFFFFF",
    ...style,
  };

  const secondaryStyles = {
    fontStyle: "normal",
    fontWeight: fontWeight || "normal",
    fontSize: fontSize || "14px",
    lineHeight: lineHeight || "18px",
    letterSpacing: "0.03em",
    color: "#D7D7D7",
    ...style,
  };

  const defaultStyles = {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: fontSize || "14px",
    lineHeight: lineHeight || "18px",
    letterSpacing: "0.03em",
    color: "#C7BEB7",
    ...style,
  };

  const styles = () => {
    if (variant === "primary") {
      return primaryStyles;
    }
    if (variant === "secondary") {
      return secondaryStyles;
    }
    return defaultStyles;
  };

  switch (component) {
    case "span":
      return (
        <span style={styles()} onClick={onClick}>
          {children}
        </span>
      );
    case "div":
      return (
        <div style={styles()} onClick={onClick}>
          {children}
        </div>
      );
    default:
      return (
        <p style={styles()} onClick={onClick}>
          {children}
        </p>
      );
  }
};

export default Text;

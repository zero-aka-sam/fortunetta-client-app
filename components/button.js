import React from "react";

const Button = (props) => {
  const { onClick, type, className, children, style } = props;

  const Styles = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    borderRadius: 8,
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "20px",
    letterSpacing: "0.03em",
    color: "#fff",
    ...style,
  };

  return (
    <button onClick={onClick} type={type} className={className} style={Styles}>
      {children}
    </button>
  );
};

export default Button;

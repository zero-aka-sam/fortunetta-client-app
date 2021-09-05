import React from "react";
import Header from "./header";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <div style={{ marginTop: "80px" }}>{children}</div>
    </div>
  );
};

export default Layout;

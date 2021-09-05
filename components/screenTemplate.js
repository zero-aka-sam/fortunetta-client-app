import React from "react";
import Chat from "./chat/chat";

const ScreenTemplate = (props) => {
  return (
    <div className="template">
      {props.children}
      <Chat />
    </div>
  );
};

export default ScreenTemplate;

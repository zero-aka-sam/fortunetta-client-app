import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Image from "next/image";
import moment from "moment";
import ScrollToBottom from "react-scroll-to-bottom";
import { useSelector } from "react-redux";
import _ from "lodash";

//STYLESHEET

import styles from "../../styles/chat.module.css";

//IMPORTING COMPONENTS

import Text from "../Text";
import Modal from "../modal";

let socket;

const Chat = () => {
  const inputRef = useRef();
  const [mobileView, setMobileView] = useState(false);
  const [connectModal, setConnectModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [msgSent, setMsgSent] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    socket = io("http://18.116.115.108:5000", {
      transports: ["websocket"],
    });
    // socket = io("http://localhost:5000", {
    //   transports: ["websocket"],
    // });
    socket.on("output_messages", (data) => {
      setMessageList(data);
    });
  }, []);

  useEffect(() => {
    socket.on("receive", (Content) => {
      setMessageList((messageList) => [...messageList, Content]);
    });
  }, [messageList]);

  const handleSubmit = (e) => {
    // console.log(inputRef.current.value);
    if (e.key === "Enter") {
      if (user?.UserID) {
        if (message) {
          setConnectModal(false);
          let Content = {
            message,
            userId: user?.address,
          };
          socket.emit("send_message", Content);
          setMsgSent(!msgSent);
        }
      } else {
        setConnectModal(true);
      }
    }
  };

  useEffect(() => {
    setMessage("");
  }, [msgSent]);

  const renderHeader = (
    <div className={styles.header}>
      <p className={styles.flexRow}>
        <Image alt="" src="/language.svg" width={20} height={20} />
        <Text
          component="span"
          variant="primary"
          fontSize="14px"
          style={{ marginLeft: 8 }}
        >
          English Room
        </Text>
      </p>
      <Text component="span" fontSize="12px" style={{ color: "#FDBB35" }}>
        {/* 1345 online */}
      </Text>
    </div>
  );

  const renderMessage = (
    <>
      {_.uniqWith(messageList, _.isEqual)?.map((messages, index) => {
        return (
          <div className={styles.message} key={index}>
            <div className={styles.messageHeader}>
              <p className={styles.flexRow}>
                {/* <Image src="/language.svg" width={20} height={20} /> */}
                <Text
                  component="span"
                  variant="secondary"
                  fontSize="12px"
                  fontWeight="500"
                  style={{ marginLeft: 8 }}
                >
                  {`#${messages?.userId?.slice(
                    0,
                    4
                  )}...${messages?.userId?.slice(
                    messages?.userId?.length - 4
                  )}`}
                </Text>
              </p>
              <Text fontSize="12px">
                {" "}
                {moment(messages?.createdAt).fromNow()}
              </Text>
            </div>
            <div className={styles.messageContent}>
              <Text variant="primary" fontSize="12px" lineHeight="18px">
                {messages.message}
              </Text>
            </div>
          </div>
        );
      })}
    </>
  );

  const renderChat = (
    <ScrollToBottom className={styles.chatMessages}>
      {renderMessage}
    </ScrollToBottom>
  );

  //RENDER NO CHAT

  const renderNoChat = (
    <div className={styles.noChat}>
      <Image alt="" src="/noMessage.svg" width={"260px"} height={"80px"} />
      <Text variant="primary" fontSize="14px">
        There’s no one in the chat yet
      </Text>
      <Text fontSize="12px" style={{ textAlign: "center" }}>
        Sorry! there are no messages in the chat at this moment. Be the first
        one the to start the conversation.
      </Text>
    </div>
  );

  const renderInput = (
    <div className={styles.input}>
      <input
        type="text"
        placeholder="Type your message here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => handleSubmit(e)}
      />
    </div>
  );
  return (
    <>
      <div className={"chat"}>
        {renderHeader}
        {messageList?.length === 0 || messageList?.length === undefined
          ? renderNoChat
          : renderChat}
        {renderInput}
      </div>
      <div className={mobileView ? "mobile_chat active" : "mobile_chat"}>
        {renderHeader}
        {messageList?.length === 0 || messageList?.length === undefined
          ? renderNoChat
          : renderChat}
        {renderInput}
        <span
          className={styles.chatCloseIcon}
          onClick={() => setMobileView(false)}
        >
          <Image
            alt=""
            src="/chatclose_icon.svg"
            width={100}
            height={100}
            className={styles.chatCloseIcon}
            onClick={() => setMobileView(false)}
          />
        </span>
      </div>
      <span
        className={styles.mobileOpenIcon}
        onClick={() => setMobileView(true)}
      >
        <Image alt="" src="/chaticon.svg" width={100} height={100} />
      </span>
      {connectModal && <Modal variant="connect" setIsModal={setConnectModal} />}
    </>
  );
};

export default Chat;

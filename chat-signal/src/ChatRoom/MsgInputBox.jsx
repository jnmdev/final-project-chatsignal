/* global BigInt */
import React, { useState } from "react";
import { sendMsg, fetchKey } from "../webSocket";
import * as AES from "../Encryption/AES.js";

const MsgInputBox = (props) => {
  const [message, setMsg] = useState("");
  const [key, setKey] = useState(0x0n);
  const [userID, setUser] = useState(props.userID);
  console.log("User in MSG: " + props.userID);
  function handleChange(event) {
    setMsg(event.target.value);
  }

  return (
    <div style={Styles.mainContainer}>
      <input
        type="text"
        placeholder="Type a message..."
        onChange={handleChange}
        value={message}
        style={Styles.textAreaStyle}
      />
      <button
        onClick={() => {
          setKey(fetchKey());
          console.log(key);
          sendMsg(userID, AES.AES_Encrypt(message, key));
          console.log(AES.AES_Encrypt(message, key));
          // sendMsg(message);
          setMsg(" ");
        }}
        style={Styles.btnStyle}
      >
        Send
      </button>
    </div>
  );
};

const Styles = {
  mainContainer: {
    display: "flex",
    padding: "0 20px",
    marginTop: 10,
    minHeight: "100%",
  },
  textAreaStyle: {
    flexGrow: 10,
    display: "flex",
    width: "100%",
    fontSize: 24,
    fontFamily: "Karla",
    padding: "15px 12px",

    maxWidth: "100%",
    minHeight: "99%",

    overflowWeap: "break-word",
    wordWrap: "break-word",

    borderStyle: "hidden",
    borderTopStyle: "solid",
    borderTopWidth: 2,
    borderColor: "gray",
  },

  btnStyle: {
    flexGrow: 3,
    display: "flex",
    alignItems: "center",

    fontSize: 24,
    borderStyle: "hidden",
    borderTopStyle: "solid",
    borderTopWidth: 2,
    backgroundColor: "transparent",
  },
};

export default MsgInputBox;

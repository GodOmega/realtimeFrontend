import React from "react";

import styles from "./style.module.css";

const Message = ({ message, type, user, userColor }) => {
  return (
    <>
      {type === "newUser" && (
        <p className={styles.new__user}> {user} se ha unido a la sala </p>
      )}

      {type === "newMessage" && (
        <p className={styles.new__message}>
          <span style={{ color: userColor }}>{user}</span>: {message}
        </p>
      )}
    </>
  );
};

export default Message;

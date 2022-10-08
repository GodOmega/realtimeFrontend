import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import styles from "./style.module.css";

import Message from "../Message";
import Modal from "../ui/Modal";

import useVideoControls from "../../hooks/useVideoControls";

const Room = ({ roomId, socket, nickname }) => {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const linkRef = useRef(null);

  const messageInput = useRef(null);
  const messageContainer = useRef(null);
  const messagesBody = useRef(null);

  const {
    videoUrl,
    sicronizando,
    videoRef,
    getUrl,
    handleActiveSync,
    handleDesactivateSync,
    changeSrc,
    onPlay,
    onBuffer,
    onPause,
    onReady,
    handleControlsPause,
    handleControlsPlay,
  } = useVideoControls(socket, roomId);

  const scrollToBottom = () => {
    if (messagesBody.current && messageContainer.current) {
      messagesBody.current.scrollTop = messagesBody.current.scrollHeight;
    }
  };

  const userConnected = (data) => {
    setMessages((state) => {
      return [...state, data];
    });
    scrollToBottom();
  };

  const messageReceived = (data) => {
    setMessages((state) => {
      return [...state, data];
    });
    scrollToBottom();
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (messageInput.current.value) {
      const messageBody = {
        message: messageInput.current.value,
        username: nickname,
        room: roomId,
      };
      socket.emit("send-message", messageBody);
      messageInput.current.value = "";
    }
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  const loadSrc = async (e) => {
    e.preventDefault();
    if (linkRef.current.value) {
      const videoId = linkRef.current.value;
      changeSrc(videoId);
      linkRef.current.value = "";
      setShowModal(false);
    }
  };

  useEffect(() => {
    socket.on("user-connected", userConnected);
    socket.on("message-received", messageReceived);
    socket.on("get-url", getUrl);
    socket.on("play-video", handleControlsPlay);
    socket.on("pause-video", handleControlsPause);
    socket.on("active-sync", handleActiveSync);
    socket.on("desactive-sync", handleDesactivateSync);
    socket.emit("join-room", roomId);

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return (
    <div>
      <div className={styles.room__container}>
        <div className={styles.video__container}>
          <div className={styles.video__wrapper}>
            {videoUrl && (
              <ReactPlayer
                ref={videoRef}
                width="100%"
                height="auto"
                onReady={onReady}
                onPlay={onPlay}
                onPause={onPause}
                onBuffer={onBuffer}
                progressInterval={1000}
                url={videoUrl}
                controls={true}
                playsinline={true}
              />
            )}
            {!videoUrl && (
              <div className={styles.noVideo__flayer}>
                <h3>Esperando URL de video</h3>
              </div>
            )}
          </div>
          {sicronizando && videoUrl && (
            <div
              className={`${styles.noVideo__flayer} ${styles.noVideo__flayer_sync}`}
            >
              <h3>Sincronizando...</h3>
            </div>
          )}
        </div>
        <div className={styles.chat__container}>
          <div className={styles.chat__header}>
            <h3>
              Chat ID: <span>{roomId}</span>
            </h3>
            <button
              onClick={() => setShowModal(true)}
              className={`${styles.loadVideo__button} button primary`}
            >
              {videoUrl ? "Cambiar video" : "Agregar video"}
            </button>
          </div>
          <div ref={messageContainer} className={styles.messages__container}>
            <div ref={messagesBody}>
              {messages.map(
                ({ message, user, messageType, userColor }, index) => (
                  <Message
                    key={index}
                    userColor={userColor}
                    message={message}
                    user={user}
                    type={messageType}
                  />
                )
              )}
            </div>
          </div>
          <form
            className={styles.sendMessage__container}
            action="#"
            onSubmit={handleSendMessage}
          >
            <input
              className={`${styles.input__text} input-control`}
              type="text"
              ref={messageInput}
              placeholder="send message"
            />
            <input
              className={`${styles.input__sendMessage} button`}
              type="submit"
              value="enviar"
            />
          </form>
        </div>
      </div>

      {showModal && (
        <Modal closeModal={onCloseModal}>
          <form
            onSubmit={loadSrc}
            className={`${styles.modal__container} input-control`}
          >
            <input ref={linkRef} type="text" placeholder="URL" required />
            <input className="button" type="submit" value="cargar video" />
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Room;

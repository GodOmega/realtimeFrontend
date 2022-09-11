import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import styles from "../styles/pages/home.module.css";

import Room from "../components/Room/Room";

const index = () => {
  const [username, setUsername] = useState(null);
  const [room, setRoom] = useState(null);
  const [socket, setSocket] = useState(null);
  const [wantJoin, setWantJoin] = useState(false);

  const nickname = useRef(null);
  const joinRoom = useRef(null);

  const handleCreateRoom = async () => {
    if (username) {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/room`
        );
        socket.emit("add-nickname", username);
        setRoom(data.room);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleJoinRoom = () => {
    const roomId = joinRoom.current.value;
    if (username && roomId) {
      socket.emit("add-nickname", username);
      setRoom(roomId);
    }
  };

  const onSubmitNickname = (event) => {
    event.preventDefault();
    setUsername(nickname.current.value);
  };

  useEffect(() => {
    if (socket === null) {
      setSocket(io(process.env.NEXT_PUBLIC_HOST));
    }
  }, [socket]);

  return (
    <main>
        {!room && (
          <div className={styles.container}>
            <div className={styles.home__actions}>
              {!username && (
                <form
                  action="#"
                  onSubmit={onSubmitNickname}
                  className={styles.actions__container}
                >
                  <input
                    type="text"
                    ref={nickname}
                    className="input-control"
                    placeholder="Ingresa tu nombre"
                    required
                  />
                  <input className="button" type="submit" value="Continuar" />
                </form>
              )}

              {username && !wantJoin && (
                <div className={styles.actions__container}>
                  <button
                    onClick={handleCreateRoom}
                    className={`button ${styles.button__option}`}
                  >
                    Crear sala
                  </button>
                  <button
                    onClick={() => setWantJoin(true)}
                    className={`button ${styles.button__option}`}
                  >
                    Unirse a una sala
                  </button>
                </div>
              )}

              {username && wantJoin && (
                <form action="#" className={styles.actions__container}>
                  <input
                    type="text"
                    ref={joinRoom}
                    className="input-control"
                    placeholder="Ingresa el ID de la sala"
                    required
                  />
                  <input
                    onClick={handleJoinRoom}
                    className="button"
                    type="submit"
                    value="Unirse"
                  />
                </form>
              )}
            </div>
          </div>
        )}

      {room && <Room roomId={room} nickname={username} socket={socket} />}
    </main>
  );
};

export default index;

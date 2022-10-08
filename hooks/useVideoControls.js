import { useRef, useState } from "react";

function useVideoControls(socket, roomId) {
  const [videoUrl, setVideoUrl] = useState(null);
  const [sicronizando, setSincronizando] = useState(false);

  const videoRef = useRef(null);

  const onPlay = () => {
    if (!sicronizando) {
      socket.volatile.emit("play-video", roomId);
    }
  };

  const onPause = () => {
    if (!sicronizando) {
      socket.volatile.emit("pause-video", roomId);
    }
  };

  const verifySync = () => {
    const player = videoRef.current;
    const currentTime = player.getCurrentTime();
    setSincronizando(true);
    socket.volatile.emit("sync", {
      room: roomId,
      currentTime,
    });
  };

  const onBuffer = () => {
    if (videoRef.current) {
      const player = videoRef.current.getInternalPlayer();
      const currentTime = Math.floor(player.getCurrentTime());
      if (player.playVideo) {
        player.pauseVideo();
      }

      if (player.play) {
        player.pause();
      }
      setTimeout(() => {
        if (currentTime) {
          verifySync();
        }
      }, 500);
    }
  };

  const onReady = (event) => {
    const player = event.getInternalPlayer();

    if (player.playVideo) {
      player.seekTo(0.02, "seconds");
      player.playVideo();
    }

    if (player.play) {
      player.play();
    }
  };

  const handleControlsPlay = () => {
    if (videoRef.current) {
      const player = videoRef.current.getInternalPlayer();
      const playerStatus = videoRef.current.player;

      if (!playerStatus.isPlaying && !sicronizando) {
        if (player.playVideo) {
          player.playVideo();
        }

        if (player.play) {
          player.play();
        }
      }
    }
  };

  const handleControlsPause = () => {
    if (videoRef.current) {
      const player = videoRef.current.getInternalPlayer();
      const playerStatus = videoRef.current.player;

      if (playerStatus.isPlaying && !sicronizando) {
        if (player.pauseVideo) {
          player.pauseVideo();
        }

        if (player.pause) {
          player.pause();
        }
      }
    }
  };

  const getUrl = (url) => {
    setVideoUrl(url);
  };

  const changeSrc = (videoId) => {
    socket.emit("load-url", { url: videoId, room: roomId });
  };

  const handleDesactivateSync = () => {
    setSincronizando(false);
  };

  const handleActiveSync = (time) => {
    if (videoRef.current) {
      setSincronizando(true);
      const player = videoRef.current.getInternalPlayer();
      player.seekTo(time, "seconds");
      setTimeout(() => {
        socket.volatile.emit("desactive-sync", roomId);
      }, 3000);
    }
  };

  return {
    videoUrl,
    sicronizando,
    videoRef,
    onPlay,
    onPause,
    onBuffer,
    onReady,
    handleControlsPlay,
    handleControlsPause,
    getUrl,
    changeSrc,
    handleDesactivateSync,
    handleActiveSync,
    verifySync
  };
}

export default useVideoControls;

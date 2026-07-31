import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../../../utils/api";
import { refreshToken } from "../../../utils/refreshToken";
import GameModal from "./GameModal";

function ReadyButton() {
  const [players, setPlayers] = useState([]);
  const [showGameModal, setShowGameModal] = useState(false);
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState({
    status: "waiting",
    message: "Join a room to start a match.",
    scores: {},
    roundsPlayed: 0,
    gameOver: false,
    finalResult: null,
    yourResult: null,
  });
  const socketRef = useRef(null);

  useEffect(() => {
    fetchUsername();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!username) return undefined;

    const socket = io(API_URL, {
      withCredentials: true,
      transports: ["websocket"],
      autoConnect: false,
    });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("joined-room", (payload) => {
      console.log(`Joined room ${payload.roomId}`);
    });

    socket.on("opponent-ready", (payload) => {
      setGameState((prev) => ({
        ...prev,
        message: `${payload.username} is ready. Choose your move.`,
      }));
    });

    socket.on("round-result", (payload) => {
      setGameState((prev) => ({
        ...prev,
        status: payload.gameOver ? "finished" : "round-result",
        message: payload.message || "Round complete",
        scores: payload.scores || {},
        roundsPlayed: payload.roundsPlayed || 0,
        gameOver: Boolean(payload.gameOver),
        finalResult: payload.finalResult || null,
        yourResult: payload.yourResult || null,
      }));
    });

    socket.on("game-error", (payload) => {
      setGameState((prev) => ({
        ...prev,
        message: payload.message || "Game error",
      }));
    });

    socket.connect();
    socketRef.current = socket;
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [username]);

  async function fetchUsername() {
    try {
      const res = await fetch(`${API_URL}/api/get-identity`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (res.status === 401) {
        const refreshData = await refreshToken();
        if (refreshData.success) {
          location.reload();
        }
      }

      if (data.success) {
        setUsername(data.data);
      }
    } catch (err) {
      console.log(`Error fetching username: ${err}`);
    }
  }

  async function readyPlayer() {
    try {
      const res = await fetch(`${API_URL}/api/ready-player`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (res.status === 401) {
        const refreshData = await refreshToken();
        if (refreshData.success) {
          location.reload();
        } else {
          console.log("Refresh token failed");
        }
      }

      if (data.success) {
        const nextRoomId = data.data.roomId;
        setPlayers(data.data.players || []);
        setRoomId(nextRoomId);
        setShowGameModal(true);
        setGameState((prev) => ({
          ...prev,
          status: "waiting",
          message: "Waiting for the other player to join the room.",
          scores: data.data.scores || {},
          roundsPlayed: data.data.roundsPlayed || 0,
          gameOver: false,
          finalResult: null,
          yourResult: null,
        }));

        if (socketRef.current && nextRoomId && username) {
          socketRef.current.emit("join-room", { roomId: nextRoomId, username });
        }
      }
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }

  return (
    <>
      <button
        onClick={() => readyPlayer()}
        disabled={players.length >= 2}
        className="btn px-5 bg-[#b14b29] mt-3 hover:bg-[#803820] text-amber-200 mb-6"
      >
        Ready
      </button>
      <GameModal
        showModal={showGameModal}
        setShowModal={setShowGameModal}
        roomId={roomId}
        username={username}
        socket={socketRef.current ?? socket}
        gameState={gameState}
        setGameState={setGameState}
      />
    </>
  );
}

export default ReadyButton;

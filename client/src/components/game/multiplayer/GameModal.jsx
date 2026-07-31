import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "rps-player-choice";

function GameModal({ showModal, setShowModal, roomId, username, socket, gameState, setGameState }) {
  const [selectedChoice, setSelectedChoice] = useState(() => {
    if (typeof window === "undefined") return null;

    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      if (!storedValue) return null;

      const parsedValue = JSON.parse(storedValue);
      return parsedValue.selectedChoice ?? null;
    } catch (error) {
      console.error("Unable to read saved choice:", error);
      return null;
    }
  });

  const [isConfirmed, setIsConfirmed] = useState(() => {
    if (typeof window === "undefined") return false;

    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      if (!storedValue) return false;

      const parsedValue = JSON.parse(storedValue);
      return parsedValue.isConfirmed ?? false;
    } catch (error) {
      console.error("Unable to read saved confirmation state:", error);
      return false;
    }
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selectedChoice, isConfirmed })
    );
  }, [selectedChoice, isConfirmed]);

  useEffect(() => {
    if (!showModal) {
      setSelectedChoice(null);
      setIsConfirmed(false);
      setIsTransitioning(false);
    }
  }, [showModal]);

  useEffect(() => {
    if (!showModal || gameState.gameOver || gameState.status !== "round-result") {
      return undefined;
    }

    setIsTransitioning(true);
    setSelectedChoice(null);
    setIsConfirmed(false);

    const nextRoundNumber = Math.min((gameState.roundsPlayed || 0) + 1, 3);
    const timeoutId = window.setTimeout(() => {
      setIsTransitioning(false);
      setGameState((prev) => ({
        ...prev,
        status: "waiting",
        message: `Round ${nextRoundNumber} is starting...`,
      }));
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [gameState.gameOver, gameState.roundsPlayed, gameState.status, setGameState, showModal]);

  useEffect(() => {
    if (gameState.gameOver && typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [gameState.gameOver]);

  if (!showModal) return null;

  const finalResultLabel = gameState.finalResult?.winnerName
    ? `${gameState.finalResult.winnerName} is the winner`
    : gameState.finalResult?.message || gameState.yourResult || gameState.message || "Match complete";

  const choices = [
    { label: "Rock", emoji: "🪨", value: "rock" },
    { label: "Paper", emoji: "📄", value: "paper" },
    { label: "Scissors", emoji: "✂️", value: "scissors" },
  ];

  const handleReady = () => {
    if (!selectedChoice || !roomId || !socket || !username) return;

    setIsConfirmed(true);
    setGameState((prev) => ({
      ...prev,
      status: "ready",
      message: "Waiting for the opponent to lock in...",
    }));

    socket.emit("player-ready", {
      roomId,
      username,
      choice: selectedChoice,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] p-4">
      <div className="flex h-full w-full max-w-2xl flex-col justify-center rounded-2xl border border-[#EADDCA] bg-[#CD7F32] p-6 text-[#6E260E] shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-semibold">Choose Your Move</h2>
            <p className="mt-2 text-lg text-[#EADDCA]">
              {gameState.gameOver
                ? "The match is over."
                : "Select your pick and confirm when you are ready."}
            </p>
          </div>
          <button
            className="rounded-full border border-[#EADDCA] px-3 py-1 text-xl text-[#EADDCA]"
            onClick={() => setShowModal(false)}
          >
            ×
          </button>
        </div>

        {gameState.gameOver ? (
          <div className="rounded-2xl border border-[#EADDCA] bg-[#E1C16E] p-6 text-center text-[#6E260E]">
            <h3 className="text-2xl font-semibold">{finalResultLabel}</h3>
            <p className="mt-3 text-lg">Final score: {gameState.scores?.[username] ?? 0} - {gameState.scores?.[Object.keys(gameState.scores).find((key) => key !== username)] ?? 0}</p>
            <p className="mt-2 text-base">{finalResultLabel}</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {choices.map((choice) => {
                const isSelected = selectedChoice === choice.value;
                return (
                  <button
                    key={choice.value}
                    disabled={isConfirmed || isTransitioning}
                    onClick={() => setSelectedChoice(choice.value)}
                    className={`rounded-xl border-2 px-4 py-6 text-center text-xl font-semibold transition ${
                      isSelected
                        ? "border-[#6E260E] bg-[#E1C16E] text-[#6E260E]"
                        : "border-[#EADDCA] bg-[#DAA06D] text-[#EADDCA]"
                    } ${(isConfirmed || isTransitioning) ? "opacity-70" : "hover:translate-y-[-2px]"}`}
                  >
                    <div className="text-4xl">{choice.emoji}</div>
                    <div className="mt-2">{choice.label}</div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-[#EADDCA] bg-[#DAA06D]/70 p-4 text-center text-[#EADDCA]">
              <p>{isTransitioning ? `Round ${Math.min(gameState.roundsPlayed + 1, 3)} is starting soon...` : gameState.message}</p>
              <p className="mt-2 text-sm">Rounds played: {gameState.roundsPlayed}</p>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleReady}
                disabled={!selectedChoice || isConfirmed || isTransitioning}
                className="rounded-full bg-[#6E260E] px-8 py-3 text-lg font-semibold text-[#EADDCA] cursor-pointer transition hover:bg-[#4b1809] disabled:cursor-not-allowed disabled:bg-[#C19A6B]"
              >
                {isConfirmed ? "Waiting..." : "Ready"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GameModal;
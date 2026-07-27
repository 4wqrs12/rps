import { useEffect, useState } from "react";

const STORAGE_KEY = "rps-player-choice";

function GameModal({ showModal, setShowModal }) {
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selectedChoice, isConfirmed })
    );
  }, [selectedChoice, isConfirmed]);

  if (!showModal) return null;

  const choices = [
    { label: "Rock", emoji: "🪨", value: "rock" },
    { label: "Paper", emoji: "📄", value: "paper" },
    { label: "Scissors", emoji: "✂️", value: "scissors" },
  ];

  const handleReady = () => {
    if (!selectedChoice) return;
    console.log("Player choice:", selectedChoice);
    setIsConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] p-4">
      <div className="flex h-full w-full max-w-2xl flex-col justify-center rounded-2xl border border-[#EADDCA] bg-[#CD7F32] p-6 text-[#6E260E] shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-semibold">Choose Your Move</h2>
            <p className="mt-2 text-lg text-[#EADDCA]">
              Select your pick and confirm when you are ready.
            </p>
          </div>
          <button
            className="rounded-full border border-[#EADDCA] px-3 py-1 text-xl text-[#EADDCA]"
            onClick={() => setShowModal(false)}
          >
            ×
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {choices.map((choice) => {
            const isSelected = selectedChoice === choice.value;
            return (
              <button
                key={choice.value}
                disabled={isConfirmed}
                onClick={() => setSelectedChoice(choice.value)}
                className={`rounded-xl border-2 px-4 py-6 text-center text-xl font-semibold transition ${
                  isSelected
                    ? "border-[#6E260E] bg-[#E1C16E] text-[#6E260E]"
                    : "border-[#EADDCA] bg-[#DAA06D] text-[#EADDCA]"
                } ${isConfirmed ? "opacity-70" : "hover:translate-y-[-2px]"}`}
              >
                <div className="text-4xl">{choice.emoji}</div>
                <div className="mt-2">{choice.label}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleReady}
            disabled={!selectedChoice || isConfirmed}
            className="rounded-full bg-[#6E260E] px-8 py-3 text-lg font-semibold text-[#EADDCA] cursor-pointer transition hover:bg-[#4b1809] disabled:cursor-not-allowed disabled:bg-[#C19A6B]"
          >
            Ready
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameModal;
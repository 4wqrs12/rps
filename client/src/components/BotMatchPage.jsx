import { useState } from "react";

function BotMatchPage() {
  // player's choice
  const [option, setOption] = useState({ text: "", item: "" });
  // boolean deciding visibility of box of all options
  const [showOptions, setShowOptions] = useState(false);
  const [disabled, setDisabled] = useState(false);

  function setItem(t, i) {
    setOption({ ...option, text: t, item: i });
  }

  function readyPlayer() {
    setShowOptions(false);
    setDisabled(true);
    console.log(option);
  }

  return (
    <div className="route-content">
      <h1 className="route-title">Bot Match</h1>
      <p>Play against the computer</p>
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="btn mt-3 border-2"
        disabled={disabled}
      >
        {option.text
          ? `${option.item} ${option.text}`
          : "Please choose an item!"}
      </button>
      {showOptions && (
        <div className="w-fit flex gap-3 border-3 border-amber-600 mt-3 rounded-lg p-3">
          <button onClick={() => setItem("Rock", "🗻")} className="btn">
            🗻
          </button>
          <button onClick={() => setItem("Paper", "📄")} className="btn">
            📄
          </button>
          <button onClick={() => setItem("Scissor", "✂️")} className="btn">
            ✂️
          </button>
        </div>
      )}
      {option.text && (
        <button className="btn mt-3" onClick={readyPlayer}>
          Ready
        </button>
      )}
    </div>
  );
}

export default BotMatchPage;

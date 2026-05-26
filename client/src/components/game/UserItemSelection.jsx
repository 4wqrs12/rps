import { useState } from "react";
import Modal from "../Modal";

function UserItemSelection({ backendRoute }) {
  const [option, setOption] = useState({ text: "", item: "" });
  const [showOptions, setShowOptions] = useState(false);
  const [show, setShow] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAgain, setShowAgain] = useState(false);
  const [winner, setWinner] = useState("");
  const [fetchedData, setFetchedData] = useState({});
  const [botScore, setBotScore] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);

  function setItem(t, i) {
    setOption({ ...option, text: t, item: i });
  }

  async function readyPlayer() {
    setShowOptions(false);
    setShow(true);
    console.log(option);
    try {
      const res = await fetch(`http://localhost:5000/api/${backendRoute}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerChoice: option.text }),
      });
      const jsonData = await res.json();
      if (jsonData.success) {
        setFetchedData(jsonData);
        setShowModal(true);
        setOption({ ...option, text: "", item: "" });
        setShow(false);
        setShowAgain(true);
        setWinner(jsonData.data.winner);
        if (jsonData.data.winner === "Player") {
          console.log(jsonData.data.score);
          setPlayerScore(jsonData.data.score);
        } else if (jsonData.data.winner === "Bot") {
          console.log(jsonData.data.score);
          setBotScore(jsonData.data.score);
        }
      }
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }

  return (
    <>
    <h2 className="font-extrabold">🤖{botScore} - 👤{playerScore}</h2>
      <div className="flex flex-col items-start">
        {show && (
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="btn mt-3"
          >
            {option.text
              ? `${option.item} ${option.text}`
              : "Please choose an item!"}
          </button>
        )}
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
      {showAgain && (
        <button className="btn mt-3" onClick={() => location.reload()}>
          Play Again
        </button>
      )}
      <button onClick={() => console.log(fetchedData)}>fetched data</button>
      <Modal
        title={fetchedData.message}
        text={winner}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
}

export default UserItemSelection;

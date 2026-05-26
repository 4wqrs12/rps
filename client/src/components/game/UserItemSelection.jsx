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

  function setItem(t, i) {
    setOption({ ...option, text: t, item: i });
  }

  function playAgain() {
    if (sessionStorage.getItem("playerScore") == 3 || sessionStorage.getItem("botScore") == 3) {
      console.log(sessionStorage.getItem("playerScore"));
      console.log(sessionStorage.getItem("botScore"));
      sessionStorage.removeItem("playerScore");
      sessionStorage.removeItem("botScore");
    }
    window.location.reload();
  }

// make bot and player points seperate component?
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
        // if (jsonData.data.final === true) {
        //   sessionStorage.removeItem("playerScore");
        //   sessionStorage.removeItem("botScore");
        // }
        if (jsonData.data.winner === "Player") {
          sessionStorage.setItem("playerScore", jsonData.data.score);
        } else if (jsonData.data.winner === "Bot") {
          sessionStorage.setItem("botScore", jsonData.data.score);
        }
      }
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }

  return (
    <>
    <h2 className="font-extrabold">🤖{sessionStorage.getItem("botScore")} - 👤{sessionStorage.getItem("playerScore")}</h2>
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
        <button className="btn mt-3" onClick={playAgain}>
          Play Again
        </button>
      )}
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

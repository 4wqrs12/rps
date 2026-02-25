import { useState } from "react";
import Modal from "../Modal";

function UserItemSelection({ backendRoute }) {
  const [option, setOption] = useState({ text: "", item: "" });
  const [showOptions, setShowOptions] = useState(false);
  const [show, setShow] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAgain, setShowAgain] = useState(false);
  const [fetchedData, setFetcheData] = useState({});

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
      const data = await res.json();
      if (data.success) {
        setFetcheData(data);
        setShowModal(true);
        setOption({ ...option, text: "", item: "" });
        setShow(false);
        setShowAgain(true);
      }
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }

  return (
    <>
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
      {showAgain && (
        <button className="btn" onClick={() => location.reload()}>
          Play Again
        </button>
      )}
      <Modal
        title={"Winner:"}
        text={fetchedData.data}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
}

export default UserItemSelection;

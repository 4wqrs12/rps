import { useState } from "react";
import RoomModal from "./RoomModal";

function RoomCreation() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        className="btn px-6 bg-[#b14b29] mt-3 hover:bg-[#803820] text-amber-200"
        onClick={() => setShowModal(true)}
      >
        Create Room
      </button>
      <RoomModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
}

export default RoomCreation;

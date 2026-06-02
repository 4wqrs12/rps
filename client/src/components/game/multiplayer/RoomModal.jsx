import { useEffect, useState } from "react";

function RoomModal({ showModal, setShowModal }) {
  const [roomName, setRoomName] = useState("");

  function roomNameHandler(e) {
    setRoomName(e.target.value);
  }

  return (
    <>
      {showModal && (
        <div className="fixed z-1 left-0 top-0 w-full h-full overflow-auto bg-[rgba(0,0,0,0.4)]">
          <div className="bg-[#CD7F32] my-[15%] mx-auto p-5 border-2 border-solid border-[#EADDCA] w-4/5 text-[#6E260E] rounded-md">
            <div>
              <button
                className="cursor-pointer text-3xl p-1 float-right"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
              <h1 className="route-title">Create a Room</h1>
            </div>
            <label htmlFor="roomName">Enter room name: </label>
            <input
              type="text"
              id="roomName"
              value={roomName}
              onChange={roomNameHandler}
              className="input-field"
              placeholder="Name..."
            />

            {roomName && (
              <button className="btn px-6 bg-[#b14b29] mt-3 hover:bg-[#803820] text-amber-500">
                +
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default RoomModal;

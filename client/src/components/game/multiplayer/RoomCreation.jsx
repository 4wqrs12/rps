import { useState } from "react";
import RoomModal from "./RoomModal";

function RoomCreation({ setRoomArray }) {
	const [showModal, setShowModal] = useState(false);

	async function getRooms() {
		try {
			const res = await fetch("http://localhost:5000/api/get-room");

			const data = await res.json();
			if (data.success) {
				setRoomArray(data.data);
				console.log(data.data);
			}
		} catch (e) {
			console.log(`Error: ${e}`);
		}
	}

	return (
		<>
			<button
				className="btn px-6 bg-[#b14b29] mt-3 hover:bg-[#803820] text-amber-200 mb-6"
				onClick={() => setShowModal(true)}
			>
				Create Room
			</button>
			<button onClick={() => getRooms()}>Refresh</button>
			<RoomModal showModal={showModal} setShowModal={setShowModal}
				setRoomArray={setRoomArray} />
		</>
	);
}

export default RoomCreation;

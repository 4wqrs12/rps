import {refreshToken} from "../../../utils/refreshToken";
import { API_URL } from "../../../utils/api";
import {useState} from "react";
import GameModal from "./GameModal";

function ReadyButton() {
	const [players, setPlayers] = useState([]);
	const [showGameModal, setShowGameModal] = useState(false);

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
					console.log(refreshData.message);
					location.reload();
				} else {
					console.log("Refresh token failed");
				}
			}
			if (data.success) {
				setPlayers(data.data.players);
				setShowGameModal(true);
				console.log(data.data.players);
				console.log(data.message);
			}
		} catch (err) {
			console.log(`Error: ${err}`);
		}
	}

	return (<>
		<button onClick={() => readyPlayer()} disabled={players.length >= 2} className="btn px-5 bg-[#b14b29] mt-3 hover:bg-[#803820] text-amber-200 mb-6">Ready</button>
		<GameModal showModal={showGameModal} setShowModal={setShowGameModal} />
	</>)
}

export default ReadyButton;

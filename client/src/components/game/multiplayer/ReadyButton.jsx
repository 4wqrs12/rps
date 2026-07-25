import {refreshToken} from "../../../utils/refreshToken";
import { API_URL } from "../../../utils/api";
import {useState} from "react";

function ReadyButton() {
	const [players, setPlayers] = useState([]);

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
				// show modal here with game in it
				setPlayers(data.data.players);
				console.log(data.data.players);
				console.log(data.message);
			}
		} catch (err) {
			console.log(`Error: ${err}`);
		}
	}

	return (<>
		<button onClick={() => readyPlayer()} disabled={players.length >= 2} className="btn px-5 bg-[#b14b29] mt-3 hover:bg-[#803820] text-amber-200 mb-6">Ready</button>
	</>)
}

export default ReadyButton;

import {refreshToken} from "../../../utils/refreshToken";

function ReadyButton() {
	
	async function readyPlayer() {
		try {
			const res = await fetch("http://localhost:5000/api/ready-player", {
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
		} catch (err) {
			console.log(`Error: ${err}`);
		}
	}

	return (<>
		<button onClick={() => readyPlayer()} className="btn px-5 bg-[#b14b29] mt-3 hover:bg-[#803820] text-amber-200 mb-6">Ready</button>
	</>)
}

export default ReadyButton;

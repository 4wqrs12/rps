import { refreshToken } from "../../../utils/refreshToken";

function RoomInfo({ roomName, playersArray, roomId }) {
  //#6E260E

	async function joinRoom() {
		try {
			const res = await fetch("http://localhost:5000/api/join-room", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({roomName, playersArray, roomId})
			});
			const data = await res.json();
			if (res.status === 401) {
				const refreshData = await refreshToken();
				if (refreshData.success) {
					location.reload();
				} else {
					console.log("Refresh token failed");
				}

				if (data.success) {
					console.log(data.data);
				}
			}
		} catch (err) {
			console.log(`Error: ${err}`);
		}
	}

	return (
    <div className="border-5 rounded-2xl border-[#6E260E] bg-amber-500">
      <div className="m-4">
        <h1 className="font-bold text-4xl">{roomName}</h1>
        <ol>
          Players:
          {playersArray.map((v, i) => (
            <p key={i}>{v}</p>
          ))}
        </ol>
        <p className="mt-3 text-gray-500">{roomId}</p>

				<button onClick={() => joinRoom()} className="border-3 p-1">Join Room</button>
      </div>
    </div>
  );
}
export default RoomInfo;

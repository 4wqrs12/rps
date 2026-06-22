import { useState, useEffect } from "react";
import RoomCreation from "./RoomCreation";
import RoomInfo from "./RoomInfo";
import { refreshToken } from "../../../utils/refreshToken";

function RoomsPage() {
	const [rooms, setRooms] = useState([]);
	const [loggedIn, setIsLoggedIn] = useState(false);

	async function fetchUsername() {
		try {
			const res = await fetch("http://localhost:5000/api/get-identity", {
				method: "POST",
				credentials: "include",
			});
			const data = await res.json();

			if (res.status === 401) {
				const refreshData = await refreshToken();
				if (refreshData.success) {
					location.reload();
				} else {
					console.log("Refresh token failed");
				}
			}
			
			if (data.success) {
				setIsLoggedIn(true);
			}
		} catch (e) {
			console.log(`Error: ${e}`);
		}
	}

	useEffect(() => {
		fetchUsername();
	}, []);

	return (
		<div className="route-content">
			<h1 className="route-title">Rooms</h1>

			{loggedIn ? (
				<>
					<p>Play against others</p>
					<RoomCreation setRoomArray={setRooms} />
					<div className="grid grid-cols-1 gap-2">
						{rooms.map((v, i) => (
							<RoomInfo key={i} roomName={v} playersArray={["p1", "p2"]} roomId={"some id"} />
						))}
					</div>
				</>) : (<p>Please log in to play multiplayer!</p>)}
		</div>
	);
}

export default RoomsPage;

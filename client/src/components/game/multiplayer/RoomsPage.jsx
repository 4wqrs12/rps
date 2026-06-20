import { useState } from "react";
import RoomCreation from "./RoomCreation";
import RoomInfo from "./RoomInfo";

function RoomsPage() {
	const [rooms, setRooms] = useState([]);
/*
          {playersArray.map((v, i) => (
            <p key={i}>{v}</p>
          ))}
					*/

  return (
    <div className="route-content">
      <h1 className="route-title">Rooms</h1>
      <p>Play against others</p>
      <RoomCreation setRoomArray={setRooms}/>
      <div className="grid grid-cols-1 gap-2">
				{rooms.map((v, i) => (
					<RoomInfo key={i} roomName={v} playersArray={["p1", "p2"]} roomId={"some id"}/>
				))}
      </div>
    </div>
  );
}

export default RoomsPage;

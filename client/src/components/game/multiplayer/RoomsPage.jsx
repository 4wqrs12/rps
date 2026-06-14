import RoomCreation from "./RoomCreation";
import RoomInfo from "./RoomInfo";

function RoomsPage() {
  return (
    <div className="route-content">
      <h1 className="route-title">Rooms</h1>
      <p>Play against others</p>
      <RoomCreation />
      <div className="grid grid-cols-1 gap-2">
        <RoomInfo
          roomName={"some name"}
          playersArray={["p1", "p2"]}
          roomId={"mongo id 1234"}
        />
      </div>
    </div>
  );
}

export default RoomsPage;

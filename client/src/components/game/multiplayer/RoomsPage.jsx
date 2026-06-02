import RoomCreation from "./RoomCreation";

function RoomsPage() {
    return ( 
        <div className="route-content">
            <h1 className="route-title">Rooms</h1>
            <p>Play against others</p>
            <RoomCreation/>
        </div>
     );
}

export default RoomsPage;
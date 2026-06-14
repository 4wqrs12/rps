function RoomInfo({ roomName, playersArray, roomId }) {
  //#6E260E
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
      </div>
    </div>
  );
}
export default RoomInfo;

import UserItemSelection from "./UserItemSelection";

function BotMatchPage() {
  return (
    <div className="route-content">
      <h1 className="route-title">Bot Match</h1>
      <p>Play against the computer</p>
      <UserItemSelection backendRoute={"bot-match"} />
    </div>
  );
}

export default BotMatchPage;

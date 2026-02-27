import { useEffect, useState } from "react";
import { refreshToken } from "../utils/refreshToken";

function HomePage() {
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

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
          console.log(refreshData.message);
          location.reload();
        } else {
          console.log("Refresh token failed");
        }
      }

      if (data.success) {
        setUsername(data.data);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.log(`Error fetching username: ${err}`);
    }
  }

  useEffect(() => {
    fetchUsername();
  }, []);

  return (
    <div className="route-content">
      <h1 className="route-title">Home</h1>
      {loggedIn ? (
        <p>Logged in as: {username}</p>
      ) : (
        <p>You are not logged in!</p>
      )}
    </div>
  );
}

export default HomePage;

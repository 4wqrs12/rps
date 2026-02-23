import { useEffect, useState } from "react";

function Home() {
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
        const refreshRes = await fetch("http://localhost:5000/api/refresh", {
          method: "POST",
          credentials: "include",
        });
        const refreshData = await refreshRes.json();
        if (refreshData.success) {
          console.log(refreshData.message);
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

export default Home;

import { useState } from "react";
import { useAuth } from "./auth/AuthProvider";

function Test() {
  const { accessToken } = useAuth();
  const [message, setMessage] = useState("");

  async function handleClick() {
    try {
      const res = await fetch("http://localhost:5000/api/get-identity", {
        method: "GET",
        credentials: "include",
      });
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
      const data = await res.json();

      if (data.success) {
        setMessage(`Logged in as: ${data.data}`);
      } else {
        setMessage("Please log in");
      }
    } catch (err) {
      console.log(`Error testing: ${err}`);
    }
  }

  return (
    <div className="route-content">
      <button className="btn border-2" onClick={handleClick}>
        Check
      </button>
      <p>{message}</p>
    </div>
  );
}

export default Test;

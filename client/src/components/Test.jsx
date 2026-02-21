import { useState } from "react";
import { useAuth } from "./auth/AuthProvider";

function Test() {
  const { accessToken } = useAuth();
  const [message, setMessage] = useState("");

  async function handleClick() {
    console.log(accessToken);
    try {
      const res = await fetch("http://localhost:5000/api/get-identity", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Logged in as: ${data.data}`);
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

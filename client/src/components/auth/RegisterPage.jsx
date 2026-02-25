import { useState } from "react";
import UserAuth from "./UserAuth";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function registerUser(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await res.json();
      setUsername("");
      setPassword("");
      console.log(`Register: ${data.message}`);
    } catch (err) {
      console.log(`Error logging in: ${err}`);
    }
  }

  return (
    <UserAuth
      title={"Register"}
      user={username}
      userHandler={handleUsernameChange}
      pass={password}
      passHandler={handlePasswordChange}
      fetchFunc={registerUser}
    />
  );
}

export default RegisterPage;

import { useState } from "react";
import UserAuth from "./UserAuth";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function loginUser(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await res.json();
      console.log(`Login: ${data.message}`);
      if (!data.success) {
        alert(data.message);
      }
    } catch (err) {
      console.log(`Error logging in: ${err}`);
    }
  }

  return (
    <UserAuth
      title={"Login"}
      user={username}
      userHandler={handleUsernameChange}
      pass={password}
      passHandler={handlePasswordChange}
      fetchFunc={loginUser}
    />
  );
}

export default LoginPage;

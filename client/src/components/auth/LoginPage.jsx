import { useState } from "react";
import { useAuth } from "./AuthProvider";

function LoginPage() {
  const { login } = useAuth();
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
      });

      const data = await res.json();
      if (data.success) {
        login(data.data.accessToken, data.data.refreshToken);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(`Error logging in: ${err}`);
    }
  }

  return (
    <div className="route-content">
      <h1 className="route-title">Login</h1>
      <div className="bg-[#C19A6B] w-64 rounded-md">
        <form onSubmit={loginUser} className="p-5">
          <div className="mb-5">
            <input
              type="text"
              placeholder="Username..."
              value={username}
              onChange={handleUsernameChange}
              className="input-field"
            />
          </div>
          <div className="mb-5">
            <input
              type="text"
              placeholder="Password..."
              value={password}
              onChange={handlePasswordChange}
              className="input-field"
            />
          </div>
          <div>
            <button
              type="submit"
              className="btn bg-[#6E260E] p-3 hover:bg-[#571e0b]"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

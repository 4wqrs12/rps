import { useState } from "react";
import { useAuth } from "./AuthProvider";

function RegisterPage() {
  const { login } = useAuth();
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
      console.log(`Register: ${data.message}`);
    } catch (err) {
      console.log(`Error logging in: ${err}`);
    }
  }

  return (
    <div className="route-content">
      <h1 className="route-title">Register</h1>
      <div className="bg-[#C19A6B] w-64 rounded-md">
        <form onSubmit={registerUser} className="p-5">
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
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;

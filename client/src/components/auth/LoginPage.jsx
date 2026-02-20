import { useState } from "react";
// TODO: connect w/ backend, same for registering
function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  return (
    <div className="route-content">
      <h1 className="route-title">Login</h1>
      <div className="bg-[#C19A6B] w-64 rounded-md">
        <form className="p-5">
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

import { useState } from "react";
import UserAuth from "./UserAuth";
import Modal from "../Modal";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fetchedData, setFetchedData] = useState({});
  const [showModal, setShowModal] = useState(false);

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
      setFetchedData(data);
      setShowModal(true);
      setUsername("");
      setPassword("");
    } catch (err) {
      console.log(`Error logging in: ${err}`);
    }
  }

  return (
    <>
      <UserAuth
        title={"Login"}
        user={username}
        userHandler={handleUsernameChange}
        pass={password}
        passHandler={handlePasswordChange}
        fetchFunc={loginUser}
      />
      {showModal && (
        <Modal
          title={fetchedData.success ? "Success" : "Error"}
          text={fetchedData.message}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
}

export default LoginPage;

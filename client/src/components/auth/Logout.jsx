import { useAuth } from "./AuthProvider";

function Logout() {
  const { accessToken, refreshToken, logout } = useAuth();

  async function logoutUser() {
    console.log(accessToken, refreshToken);
    try {
      if (accessToken) {
        const res = await fetch("http://localhost:5000/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        console.log(`accesstoken message: ${data.message}`);
      }

      if (refreshToken) {
        await fetch("http://localhost:5000/api/logout-refresh", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });
      }
    } catch (err) {
      console.log("Logout API failed, continuing...");
    }

    logout();
  }
  return (
    <button onClick={logoutUser} className="navbar-routes">
      Logout
    </button>
  );
}

export default Logout;

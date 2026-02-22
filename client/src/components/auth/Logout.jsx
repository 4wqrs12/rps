import { useAuth } from "./AuthProvider";

function Logout() {
  const { accessToken, refreshToken, logout } = useAuth();

  async function logoutUser() {
    console.log(accessToken, refreshToken);
    try {
      const res = await fetch("http://localhost:5000/api/logout", {
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
      console.log(`logout msg: ${data.message}`);
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

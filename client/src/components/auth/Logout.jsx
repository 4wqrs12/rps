import { refreshToken } from "../../utils/refreshToken";

function Logout() {
  async function logoutUser() {
    try {
      const res = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.status === 401) {
        const refreshData = await refreshToken();
        if (refreshData.success) {
          console.log(refreshData.message);
        } else {
          console.log("Refresh token failed");
        }
      }
      console.log(`logout msg: ${data.message}`);
      location.href = "/";
    } catch (err) {
      console.log("Logout API failed, continuing...");
    }
  }
  return (
    <button onClick={logoutUser} className="navbar-routes">
      Logout
    </button>
  );
}

export default Logout;

import {useEffect, useState} from "react";
import { API_URL } from "../../../utils/api";
import {refreshToken} from "../../../utils/refreshToken";
import ReadyButton from "./ReadyButton";

function MultiPlayerPage() {
	const [loggedIn, setIsLoggedIn] = useState(false);

 async function fetchUsername() {
    try {
      const res = await fetch(`${API_URL}/api/get-identity`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (res.status === 401) {
        const refreshData = await refreshToken();
        if (refreshData.success) {
          console.log(refreshData.message);
          location.reload();
        } else {
          console.log("Refresh token failed");
        }
      }

      if (data.success) {
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.log(`Error fetching username: ${err}`);
    }
  }

  useEffect(() => {
    fetchUsername();
  }, []);



	return(
		<div className="route-content">
			<h1 className="route-title">Multiplayer</h1>
			{loggedIn? (<ReadyButton/>) : (<p>You must be logged in to play multiplayer!</p>)}
		</div>
	);
}

export default MultiPlayerPage;

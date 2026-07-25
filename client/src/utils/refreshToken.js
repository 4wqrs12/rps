import { API_URL } from "./api";

export async function refreshToken() {
	try {
		const refreshRes = await fetch(`${API_URL}/api/refresh`, {
			method: "POST",
			credentials: "include",
		});
		const refreshData = await refreshRes.json();
		return refreshData;
	} catch (err) {
		console.log("Refresh token API failed.");
		return {
			success: false, message: "Refresh failed"
		};
	}
}

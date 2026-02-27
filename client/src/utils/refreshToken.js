export async function refreshToken() {
  try {
    const refreshRes = await fetch("http://localhost:5000/api/refresh", {
      method: "POST",
      credentials: "include",
    });
    const refreshData = await refreshRes.json();
    return refreshData;
  } catch (err) {
    console.log("Refresh token API failed.");
    return { success: false, message: "Refresh failed" };
  }
}

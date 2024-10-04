








export const fetchWebApi = async (token, endpoint, method, body) => {
    try {
        const res = await fetch(`https://api.spotify.com/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method,
            body: JSON.stringify(body)
        });
        //THIS IS NOT TESTED YET.
        if (res.status === 401) {
            // Token expired or invalid, try refreshing the token
            console.log("Token expired or invalid, refreshing token...");
            // Call your function to refresh the token
            const newToken = await refreshToken(); // Assuming refreshToken is a function that gets a new token
            // Retry the request with the new token
            return await fetchWebApi(newToken, endpoint, method, body);
        }

        // Handle other status codes if needed

        return await res.json();
    } catch (error) {
        console.error("Error occurred while fetching:", error);
        throw error; // Re-throw the error for the caller to handle
    }
}
//Attempting to fix the refresh token problem. The idea is to throw it for a refreshed token.
const refreshToken = async () => {
    console.log("Refreshing access token...");
    // Make a request to your backend to refresh the token
    const response = await fetch('your_refresh_token_endpoint', {
        method: 'POST',
        // Include any necessary data for token refresh (e.g., refresh token)
        body: JSON.stringify({ refreshToken: 'your_refresh_token' }),
export const fetchWebApi = async (token, endpoint, method, body) => {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    console.log("New access token received:", data.accessToken);
    return data.accessToken; // Assuming your backend returns the new access token
}


// export const fetchWebApi = async (token, endpoint, method, body) => {
//     console.log("Getting new token");
//     const res = await fetch(`https://api.spotify.com/${endpoint}`, {
//         headers: {
//         Authorization: `Bearer ${token}`,
//         },
//         method,
//         body:JSON.stringify(body)
//     });
//     return await res.json();
// }

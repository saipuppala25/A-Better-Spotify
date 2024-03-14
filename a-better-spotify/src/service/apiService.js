export const fetchWebApi = async (token, endpoint, method, body) => {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
        method,
        body:JSON.stringify(body)
    });
    return await res.json();
}


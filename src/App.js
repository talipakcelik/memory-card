import React from "react";
import Card from "./components/Card";

export default function App() {
  const [token, setToken] = React.useState("");
  const [albums, setAlbums] = React.useState();

  React.useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    // getToken()

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);

    const options = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    fetch(
      "https://api.spotify.com/v1/artists/7KomCxZv6D5qCVvefwMnwB/albums?market=ES&limit=12",
      options
    ).then((res) =>
      res.json().then((data) => {
        const images = data.items.map((el) => {
          return el.images[1];
        });
        setAlbums(images);
        console.log(images);
        return;
      })
    );
  }, []);

  const CLIENT_ID = "685f5f40e8744557af40be824fe3f9f0";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  return (
    <div style={{ color: "white" }}>
      {!token ? (
        <a
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
        >
          Login to Spotify
        </a>
      ) : (
        <button onClick={logout}>Logout</button>
      )}
    </div>
  );
}

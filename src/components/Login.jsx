import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Context";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null); // Add state to manage errors
  const { setUserInfo } = useContext(UserContext);

  const login = async (event) => {
    event.preventDefault();

    try {
      // Send data to the API
      const res = await fetch(`https://express-write.onrender.com/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 200) {
        const info = await res.json();
        setUserInfo({ id: info.id, username: info.username });
        setRedirect(true);
      } else if (res.status === 401) {
        setError("Incorrect username or password");
      } else {
        setError("An error occurred");
      }
    } catch (error) {
      setError("An unexpected error occurred"); // Handle unexpected errors
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="pt-8 items-center justify-center">
      <form
        onSubmit={login}
        className="shadow-md my-5 flex flex-col gap-5 mx-auto w-fit p-8 text-[#232e52]"
      >
        <h3 className="text-lg font-semibold">Welcome to ExpressWrite</h3>
        <input
          name="username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          className="border-none focus:border-none outline-none ring-0 bg-[#232e52] rounded-md p-3 bg-opacity-10 text-[#232e52]"
          type="text"
          placeholder="username"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          name="password"
          className="border-none focus:border-none outline-none ring-0 bg-[#232e52] rounded-md p-3 bg-opacity-10 text-[#232e52]"
          type="password"
          placeholder="password"
          required
        />
        <button
          className="bg-[#232E52] text-white text-lg rounded-md shadow-md py-3 hover:bg-[#2e417a]"
          type="submit"
        >
          Login
        </button>
        {error && <div className="text-red-500">{error}</div>}{" "}
        {/* Display error message */}
      </form>
    </div>
  );
};

export default Login;

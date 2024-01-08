import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Context";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);
  const { setUserInfo } = useContext(UserContext);

  const login = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch(`https://express-write.onrender.com/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 200) {
        const { id, username, token } = await res.json();

        // Store the token in local storage or a secure cookie for future use
        localStorage.setItem("token", token);

        setUserInfo({ id, username });
        setRedirect(true);
      } else if (res.status === 401) {
        setError("Incorrect username or password");
      } else {
        setError("An error occurred");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="pt-8 items-center justify-center min-h-[75vh]">
      <form
        onSubmit={login}
        className="shadow-md my-5 flex flex-col gap-5 mx-auto w-full max-w-[400px] p-8 text-[#232e52]"
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
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
};

export default Login;

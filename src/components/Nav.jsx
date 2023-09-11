import React, { useEffect, useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../Context";

const Nav = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://express-write.onrender.com/profile`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Request failed with status " + res.status);
        }
        return res.json();
      })
      .then((info) => {
        setUserInfo({ id: info.id, username: info.username });
        setLoading(false); // Mark loading as complete
      })
      .catch((error) => {
        setError(error); // Set the error state
        setLoading(false); // Mark loading as complete
      });
  }, []);

  async function logout() {
    try {
      await fetch(`https://express-write.onrender.com/logout`, {
        credentials: "include",
        method: "POST",
      });
      setUserInfo(null);
      alert("You are logged out!");
      setRedirect(true);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  if (loading) {
    return <div>Loading...</div>; // Show a loading message
  }

  if (error) {
    console.error("Profile error:", error);
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="bg-[#232E52] max-w-[1440px] text-white px-10 py-5 border-0 flex justify-between items-center h-auto w-[90%] mx-auto">
      <div className="flex items-center justify-between w-full">
        <Link to="/" className="text-lg font-bold tracking-widest">
          E<span className="text-red-300 font-extrabold">/</span>W
        </Link>
        <nav className="flex items-center w-auto gap-6">
          {userInfo ? (
            <>
              <Link
                to="/new"
                className="block md:inline-block md:mt-0 mx-2 py-2 text-white hover:text-gray-900 flex-shrink-0"
              >
                Write Article
              </Link>
              <button
                onClick={logout}
                className="block md:inline-block md:mt-0 mx-2 py-2 text-white hover:text-gray-900"
              >
                Logout ({userInfo.username})
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="block md:inline-block md:mt-0 mx-2 py-2 text-white hover:text-gray-900"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="block md:inline-block md:mt-0 mx-2 py-2 text-white hover:text-gray-900"
              >
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Nav;

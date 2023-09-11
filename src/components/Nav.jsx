import React, { useEffect, useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../Context";

const Nav = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user profile to check if the user is authenticated
    async function fetchUserProfile() {
      try {
        const token = localStorage.getItem("token"); // Get the JWT token from local storage

        const res = await fetch(`https://express-write.onrender.com/profile`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token in the headers
          },
        });

        if (res.status === 200) {
          const info = await res.json();
          setUserInfo({ id: info.id, username: info.username });
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false); // Mark loading as complete
      }
    }

    fetchUserProfile();
  }, [setUserInfo]);

  async function logout() {
    try {
      const token = localStorage.getItem("token"); 

      await fetch(`https://express-write.onrender.com/logout`, {
        credentials: "include",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(null);
      localStorage.removeItem("token"); // Remove the token from local storage
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

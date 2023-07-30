import { Children, createContext, useState } from "react";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const BlogContext = createContext()

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([])
  return (
    <BlogContext.Provider value={{ blogs, setBlogs }}>
      {children}
    </BlogContext.Provider>
  )
}
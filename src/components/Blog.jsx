import React, { useContext, useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { BlogContext } from "../Context";

const Blog = () => {
  const { blogs, setBlogs } = useContext(BlogContext);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/posts`)
      .then((res) => res.json())
      .then((data) => setBlogs(data));
  }, []);

  console.log(blogs);
  return (
    <div className="justify-start flex flex-col gap-10 py-24 h-full min-h-[100vh]">
      <h1 className="text-[#232E52] text-4xl font-bold px-5 md:px-[120px] ">
        Our Articles
      </h1>
      {blogs.map((b) => (
        <BlogCard {...b} key={b._id} />
      ))}
    </div>
  );
};

export default Blog;

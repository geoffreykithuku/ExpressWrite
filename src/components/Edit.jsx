import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate, useParams } from "react-router-dom";
import imageConverter from "./utils/imageConverter";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};
const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

const Edit = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState("");
  const [files, setFiles] = useState(null);

  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(`https://express-write.onrender.com/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setContent(data.content);
        setCover(data.cover);
      });
  }, [id]);

  const updatePost = async (ev) => {
    ev.preventDefault();
    const data = new FormData();

    data.set("title", title);
    data.set("content", content);
    data.set("id", id);
    if (files?.[0]) {
      const img = await imageConverter(files[0]);
      setCover(img);

      data.set("file", cover);
    }

    // send data to api
    try {
      const res = await fetch(`https://express-write.onrender.com/posts/`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });

      const responseData = await res.json();

      if (res.ok) {
        alert("Post updated successfully");
        setRedirect(true);
      } else if (res.status === 400) {
        alert(responseData.error || "Failed to update the post");
      } else if (res.status === 403) {
        alert("You are not authorized to update this post");
      } else {
        alert("Failed to update the post");
      }
    } catch (error) {
      alert("An error occurred while updating the post");
      console.error("Error in updatePost:", error);
    }
  };

  if (redirect) {
    return <Navigate to={`/blog/${id}`} />;
  }

  return (
    <div className="flex items-center justify-center w-[60%] mx-auto py-12">
      <form
        onSubmit={updatePost}
        className="flex flex-col gap-5 w-full shadow-md p-5"
      >
        <h3 className="text-lg font-semibold">Edit your article here</h3>

        <input
          type="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="border-none focus:border-none outline-none ring-0 bg-[#232e52] rounded-md p-3 bg-opacity-10 text-[#232e52]"
          placeholder="Title of your article"
        />
        <input
          type="file"
          placeholder="Upload cover image"
          onChange={(e) => setFiles(e.target.files)}
          className="border-none focus:border-none outline-none ring-0 bg-[#232e52] rounded-md p-3 bg-opacity-10 text-[#232e52]"
        />
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={content}
          onChange={(newValue) => setContent(newValue)}
        />

        <button
          className="bg-[#232E52] text-white text-lg rounded-md shadow-md py-3 hover:bg-[#2e417a] w-max px-5"
          type="submit"
        >
          Update Post
        </button>
      </form>
    </div>
  );
};

export default Edit;

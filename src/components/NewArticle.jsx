import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";

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

const NewArticle = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [cover, setCover] = useState("");
  const [error, setError] = useState(null);

  if (files[0]) {
    const preview = (file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setCover(reader.result);
      };
    };

    preview(files[0]);
  }

    const createPost = async (ev) => {
      ev.preventDefault();

      try {
        // Get the JWT token from local storage
        const token = localStorage.getItem("token");

        // Send data to the API with the JWT token in the headers
        const res = await fetch(`https://express-write.onrender.com/create`, {
          method: "POST",
          body: JSON.stringify({
            title,
            content,
            cover: cover,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the JWT token in the headers
          },
          credentials: "include",
        });

        if (res.status === 201) {
          alert("Post created successfully");
          setRedirect(true);
        } else {
          throw new Error("Failed to create post");
        }
      } catch (error) {
        setError(error.message);
      }
    };


  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="flex items-center justify-center w-[60%] mx-auto py-12">
      <form
        onSubmit={createPost}
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
          Create Post
        </button>

        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
};

export default NewArticle;

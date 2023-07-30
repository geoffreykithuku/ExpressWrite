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
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const createPost = async (ev) => {
    ev.preventDefault();
    const data = new FormData();

    data.set("title", title);
    data.set("content", content);
    data.set("file", files[0]);

    // send data to api
    const res = await fetch(`${process.env.REACT_APP_API_URL}/create`, {
      method: "POST",
      body: data,
      credentials: "include",
    });

    console.log(await res.json());

    if (res.status === 201) {
      alert("Post created successfully");
      setRedirect(true);
    } else {
      alert("failed");
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
      </form>
    </div>
  );
};

export default NewArticle;

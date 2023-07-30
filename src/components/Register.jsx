import React, { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // send data to api
    const res = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      alert("success");
    } else {
      alert("failed");
    }
  };

  return (
    <div className="pt-8 items-center justify-center">
      <form
        className="shadow-md my-5 flex flex-col gap-5 mx-auto w-fit p-8 text-[#232e52]"
        onSubmit={handleSubmit}
      >
        <h3 className="text-lg font-semibold">Welcome to ExpressWrite</h3>
        <input
          value={form.username}
          className="border-none focus:border-none outline-none ring-0 bg-[#232e52] rounded-md p-3 bg-opacity-10 text-[#232e52]"
          type="text"
          name="username"
          placeholder="username"
          onChange={handleInputChange}
        />
        <input
          value={form.email}
          className="border-none focus:border-none outline-none ring-0 bg-[#232e52] rounded-md p-3 bg-opacity-10 text-[#232e52]"
          type="email"
          name="email"
          placeholder="email"
          onChange={handleInputChange}
        />
        <input
          value={form.password}
          className="border-none focus:border-none outline-none ring-0 bg-[#232e52] rounded-md p-3 bg-opacity-10 text-[#232e52]"
          type="password"
          name="password"
          placeholder="password"
          onChange={handleInputChange}
        />
        <input
          value={form.confirmPassword}
          className="border-none focus:border-none outline-none ring-0 bg-[#232e52] rounded-md p-3 bg-opacity-10 text-[#232e52]"
          type="password"
          name="confirmPassword"
          placeholder="confirm password"
          onChange={handleInputChange}
        />
        <button
          className="bg-[#232E52] text-white text-lg rounded-md shadow-md py-3 hover:bg-[#2e417a]"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;

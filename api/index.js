const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const cloudinary = require(".utils/cloudinary");

const Post = require("./models/Post");

const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "https://express-write-gamma.vercel.app",
  })
);
app.use(express.json());

const salt = bcrypt.genSaltSync(10);
const secret = "idgaf";

(async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://geoffrey:495AcSXI168qI0q7@cluster0.p0nao8e.mongodb.net/express_write?retryWrites=true&w=majority"
    );

    app.listen(3001, () => {
      console.log("Server started");
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
})();

app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const userDoc = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, salt),
    });
    res.send({ user: userDoc });
  } catch (e) {
    res.status(400).json({ error: "Error registering user" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDoc = await User.findOne({ username });

    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);

      if (passOk) {
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
          if (err) {
            res.status(500).json({ error: "Error signing token" });
          } else {
            res.cookie("token", token).json({
              id: userDoc._id,
              username,
            });
          }
        });
      } else {
        res.status(401).json({ error: "Wrong credentials" });
      }
    } else {
      res.status(401).json({ error: "User not found" });
    }
  } catch (e) {
    res.status(400).json({ error: "Error logging in" });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      res.json(info);
    }
  });
});

app.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token").json("ok");
  } catch (e) {
    res.status(500).json({ error: "Error logging out" });
  }
});

app.post("/create", async (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const { title, content, cover } = req.body;

    try {
      //upload image to cloudinary
      const img_url = await cloudinary.uploader.upload(cover, {
        folder: "express-write",
      });

      const postDoc = await Post.create({
        title: title,
        content: content,
        cover: {
          public_id: img_url.public_id,
          url: img_url.secure_url,
        },
        author: info.id,
      });

      res.status(201).json(postDoc);
    } catch (e) {
      console.error(e);
    }
  });
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("author", ["username"]);

    res.json(posts);
  } catch (e) {
    console.error(e);
  }
});

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate("author", [
      "username",
      "_id",
    ]);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/posts", async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;

      const { id, title, content, cover } = req.body;

      const postDoc = await Post.findById(id);

      if (!postDoc) {
        return res.status(404).json({ error: "Post not found" });
      }

      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);

      if (!isAuthor) {
        return res.status(403).json({ error: "You are not the author" });
      }

      await postDoc.updateOne({
        title,
        content,
        cover,
      });

      res.status(200).json(postDoc);
    });
  } catch (error) {
    console.error("Error in route handler:", error);
    res.status(500).json({ error: "Server error" });
  }
});

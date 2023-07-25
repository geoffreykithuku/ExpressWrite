const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const Post = require("./models/Post");

const fs = require("fs");

const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(express.json());

app.use("/uploads", express.static(__dirname + "/uploads"));

const salt = bcrypt.genSaltSync(10);
const secret = "idgaf";

mongoose.connect(
  "mongodb+srv://geoffrey:495AcSXI168qI0q7@cluster0.p0nao8e.mongodb.net/express_write?retryWrites=true&w=majority"
);

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
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDoc = await User.findOne({ username });

    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);

      if (passOk) {
        // login functionality
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json({
            id: userDoc._id,

            username,
          });
        });
      } else {
        res.status(401).json("wrong credentials");
      }
    } else {
      res.status(401).json("user not found");
    }
  } catch (e) {
    res.status(400).json(e);
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;

    res.json(info);
  });
  res.json(req.cookies);
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/create", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];

  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const { title, content } = req.body;

    const postDoc = await Post.create({
      title,
      content,
      cover: newPath,
      author: info.id,
    });

    res.status(201).json(postDoc);
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
  const post = await Post.findById(id).populate("author", ["username"]);

  res.json(post);
});

app.listen(3001, () => {
  console.log("Server started");
});

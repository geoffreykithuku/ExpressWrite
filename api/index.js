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

(async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://geoffrey:495AcSXI168qI0q7@cluster0.p0nao8e.mongodb.net/express_write"
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

// The "/create" and "/posts" routes remain unchanged.
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


app.patch("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];

    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }
  

  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, content } = req.body;
    
    const postDoc = await Post.findById(id)
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      res.status(400).json('You are not the author')
      
}
   postDoc.updateOne({title, content, cover: newPath? newPath : postDoc.cover})

   

    res.status(200).json(postDoc);
  });
});

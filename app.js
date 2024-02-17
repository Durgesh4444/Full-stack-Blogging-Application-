require("dotenv").config();
const express = require("express");

const path = require("path");
const cookieParser = require('cookie-parser')
const handleConnectMongoDB = require("./connection");

const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog")
const { CheckForAuthenticationCookie } = require("./middelwares/authentication");
const Blog = require('./models/blog')
const Comment = require('./models/comments')

const app = express();
const PORT = process.env.PORT || 8000;

handleConnectMongoDB(process.env.MONGO_URL, {autoIndex: true })
  .then((result) => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(Error, err);
  });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(CheckForAuthenticationCookie("token"))

// to access uploads file over client side 
app.use(express.static(path.resolve('./public')))

app.get("/", async(req, res) => {
  const allBlog = await Blog.find({}).populate("createdBy")
  const comments =await Comment.find({})
  
  console.log(comments.filter(item => (item.createdBy== "65c38326ec5d52f38150e115")));
  return res.render("home", {user:req.user, blogs:allBlog, comments:comments});
});


app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => {
  console.log(`Server started At port : ${PORT}`);
});

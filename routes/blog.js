const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Blog = require("../models/blog");
const Comment = require("../models/comments");

// taken from npm multer multer.diskStorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

//   -------------------------

router.get("/addblog", (req, res) => {
  return res.render("addBlog", { user: req.user });
});

router.get("/myblog", async (req, res) => {
  const myBlogs = await Blog.find({ createdBy: req.user._id });
  const comments =await Comment.find({})
  return res.render("myBlog", { user: req.user, myBlogs: myBlogs, comments:comments });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  // console.log(req.body);
  // console.log(req.file);
  const { title, description } = req.body;

  if (
    !req.file ||
    req.file.filename == undefined ||
    title == "" ||
    description == ""
  ) {
    return res.render("addBlog", {
      user: req.user,
      error: "All field's are required !",
    });
  } else {
    const blog = await Blog.create({
      title,
      description,
      createdBy: req.user._id,
      coverImage: `/uploads/${req.file.filename}`,
    });
    // return res.redirect('/')

    return res.redirect(`/blog/${blog._id}`);
  }
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id }).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  return res.render("blog", { user: req.user, blog: blog, comments: comments });
});

router.post("/comment/:blogId", async (req, res) => {
  const { content } = req.body;
  const blog = await Blog.findOne({ _id: req.params.blogId }).populate(
    "createdBy"
  );
  const comments = await Comment.find({ blogId: req.params.blogId }).populate(
    "createdBy"
  );

  try {
    await Comment.create({
      content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
  } catch (error) {
    return res.render("blog", {
      user: req.user,
      blog: blog,
      comments: comments,
      error: "Comments can not be empty !",
    });
  }
});

// --------------------------------------------------------------------------

router.get("/edit-post/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  return res.render("update", {
    user:req.user,
    title: blog.title,
    description: blog.description,
    createdBy: blog.createdBy,
    coverImage: blog.coverImage,
    blog:blog
  });
});

// for update req 
router.post("/update/:id", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const blog = await Blog.findById(req.params.id);

    await Blog.findByIdAndUpdate(req.params.id, {
      title: title !== '' ? title : blog.title,
      description: description !== '' ? description : blog.description,
      coverImage: req.file ? `/uploads/${req.file.filename}` : blog.coverImage,
    });

    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  return res.redirect("/");
});

module.exports = router;

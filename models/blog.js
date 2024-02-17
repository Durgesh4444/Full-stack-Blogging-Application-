const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
title:{
    type:String,
    require:true
},
description:{
    type:String,
    require:true
},
coverImage:{
    type:String,
    require:true
},
createdBy :{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
}
}, {timestamps:true})

const Blog = mongoose.model("blog", blogSchema)

module.exports = Blog;
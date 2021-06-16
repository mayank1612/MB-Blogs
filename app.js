const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose=require("mongoose");
const app = express();

mongoose.connect('mongodb+srv://mb-admin:mb-admin@cluster0.qokx2.mongodb.net/mbblogsDB', {useNewUrlParser: true, useUnifiedTopology: true});

const blogSchema = new mongoose.Schema({
  title:{
    type:String,
    minLength:1
  },
  body:{
    type:String,
    minLength:3
  }
});


const Blog=mongoose.model("Blog",blogSchema);



const homeStartingContent = "MB Blogs is a personal blog web app made by and for Mayank Bhagyawani. Here I post my ideas, journey, tech stuff and lot more!.."
const contactContent =
  "Soon going to add portfolio here...";



app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {

  Blog.find({}, function(err, blogs){

    res.render("home", {
 
      homeContent: homeStartingContent,
 
      allBlogs: blogs
 
      });
 
  })
})


app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
})

app.get("/compose", function (req, res) {
  res.render("compose");
})

app.get("/blogs/:id", function (req, res) {
  const selectedBlog = req.params.id;
  Blog.findOne({_id:selectedBlog},function(err,blog){
    if(!err){
      res.render("blog",{blogTitle:blog.title, blogBody:blog.body});
    }else{
      res.send("No such blog exists!..");
    }
  })
})

app.post("/compose", function (req, res) {
  const newBlog=new Blog({
    title: req.body.postTitle,
    body:req.body.postBody
  });

  newBlog.save(function (err) {
    if(!err){
      res.redirect("/");

    }
  });

})

let port=process.env.PORT;
if(port==null || port==""){
  port=3000;
}


app.listen(port, function () {
  console.log("Server started on port 3000");
});

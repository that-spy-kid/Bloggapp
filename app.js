//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeStartingContent = "Daily Journal is Blog app, in which we can able to post our day-to-day updates and describes various innovative content and to share the key insights.";
const aboutContent = "We, the daily journal is a blog post site that which we can able to post the content on various interests topics  and can also able to post our  personal experiences and many more individual insights to help peers and to aware & guided them in good direction. ";
const contactContent = "We hope that this blog site would help you out in some way that we can take necessary steps to do something in individual interest , please try to post some more blogs which would help for many more individuals.You can post blog any time by just navigating to /compose from home page, so what're you looking for,  post your blog right now !";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/blogDB");

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

      Post.find({}, (err,posts)=>{
        res.render("home", {
          startingContent : homeStartingContent,
         posts: posts
        });
      });
});



app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post( {
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save((err)=>{
    if(!err){
      res.redirect("/");
    }
  });

});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id:requestedPostId}, (err,post)=>{
    res.render("post", {

      title: post.title,
      content : post.content
    });
  });

});



app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});

//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://kshitiz:hulkhulk23@cluster0.bjm6xeb.mongodb.net/wikiDB");

const articleSchema={
    title: String,
    content: String
}

const Article=mongoose.model("Article",articleSchema);


//Individual requests

// app.get("/articles", function(req,res){
//   Article.find(function(err, foundArticles){
//     if(!err)
//     res.send(foundArticles);
//     else
//     res.send(err);
//   });
// });

// app.post("/articles", function(req, res){
// const newArticle=new Article({
//   title: req.body.title,
//   content: req.body.content
// });

// newArticle.save(function(err){
//   if(!err)
//   res.send("Successfully added.");
//   else
//   res.send(err);
// });
// });

// app.delete("/articles",function(req,res){
//   Article.deleteMany(function(err){
//     if(!err)
//     res.send("Successfully deleted all articles");
//     else
//     res.send(err);
//   })
// });




//Chained methods for all articles collectively
app.route("/articles")
.get(function(req,res){
  Article.find(function(err, foundArticles){
    if(!err)
    res.send(foundArticles);
    else
    res.send(err);
  });
})

.post(function(req, res){
  const newArticle=new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err)
    res.send("Successfully added.");
    else
    res.send(err);
  });
  })

  .delete(function(req,res){
    Article.deleteMany(function(err){
      if(!err)
      res.send("Successfully deleted all articles");
      else
      res.send(err);
    })

  });



  
//Chained methods for a single article

app.route("/articles/:articleTitle")

.get(function(req,res){

  Article.findOne({title:req.params.articleTitle}, function(err,foundArticle){
    if(foundArticle)
    res.send(foundArticle);
    else
    res.send("Article with this title does not exist :(");
  });
})


.put(function(req, res){

  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected article.");
      }
    }
  );
})

.patch(function(req, res){

  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    }
  );
});

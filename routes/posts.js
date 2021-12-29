const express = require("express");
const router = express.Router();
const Post = require("../models/post")
const path = require('path')
const Category = require('../models/category')
const User = require("../models/user")


router.get("/add", function (req, res) {
  if (!req.session.userId) {
    res.redirect("/users/login");
  }
  else {
    Category.find({}).then(categories => {
      res.render('index/post', { categories: categories })
    })
  }
});
router.post("/test", function (req, res) {
  
  Post.create({
    ...req.body,
    author: req.session.userId
  })
  res.redirect("/")
});

router.get("/:id", function (req, res) {
  Post.findById(req.params.id).populate({ path: 'author', model: User }).then(post => {
    Category.aggregate([
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'category',
          as: 'posts'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          num_of_posts: { $size: '$posts' }
        }
      }
    ]).then(categories => {
      Post.find({}).populate({ path: 'author', model: User }).sort({ $natural: -1 }).then(posts => {
        res.render("index/single", { post: post, categories: categories, posts: posts })

      })

    })

  })

});

router.get('/category/:categoryId', (req, res) => {
  Post.find({ category: req.params.categoryId }).populate({ path: 'category', model: Category }).populate({ path: 'author', model: User }).then(posts => {
    Category.aggregate([
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'category',
          as: 'posts'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          num_of_posts: { $size: '$posts' }
        }
      }
    ]).then(categories => {
      res.render('index/site', { posts: posts, categories: categories })
    })
  })
})




module.exports = router;

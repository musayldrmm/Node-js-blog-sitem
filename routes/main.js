const express = require("express");
const Category = require("../models/category");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user")
router.get("/abaout", function (req, res) {
  res.render("index/about");
});
router.get("/iletisim", function (req, res) {
  res.render("index/iletişim");
});
router.get("/admin", (req, res) => {
  res.render('admin/admin')
})

 


router.get("/", function (req, res) {
  console.log(req.session)
  const postPerPage=3
  const page=req.query.page||1
 
  Post.find({}).populate({ path: 'author', model: User }).sort({ $natural: -1 })
    .skip((postPerPage*page)-postPerPage)
    .limit(postPerPage).then(posts => {
      Post.countDocuments().then(postCount=>{
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
          res.render("index/site", { 
            posts: posts, 
            categories: categories,
            current:parseInt(page),
            pages:Math.ceil(postCount/postPerPage)
          })
        })
      })
   
  })
});

module.exports = router;

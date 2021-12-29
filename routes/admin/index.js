const express = require("express");
const router = express.Router();
const Category = require('../../models/category')
const Post = require('../../models/post')


router.get("/admin", function (req, res) {
    res.render('admin/admin')
});
router.get("/categories", function (req, res) {
    Category.find({}).sort({$natural:-1}).then(categories => {
        res.render('admin/categories', { categories: categories })
    })
});
router.get("/link", function (req, res) {
    Post.find({}).populate({path:'category',model:Category}).sort({$natural:-1}).then(posts=>{
        res.render("admin/link",{posts:posts})}
   )
});
router.post("/categories", function (req, res) {
    Category.create(req.body, (error, category) => {
        if (!error) {
            res.redirect('categories')
        }
    })
});
router.get('/link/edit/:id', function (req, res) {
    Post.findOne({_id:req.params.id}).then(post=>{
        Category.find({}).then(categories=>{
            res.render('admin/editpost',{post:post,categories:categories})
        })
    })
});


router.put('/link/:id',(req,res)=>{
    Post.findOne({_id:req.params.id}).then(post=>{
        post.title=req.body.title
        post.content=req.body.content
        post.date=req.body.date
        post.category=req.body.category

        post.save().then(post=>{
            res.redirect('/admin/link')
        })
    })
})
router.delete("/categories/:id", (req, res)=> {
    Category.remove({_id: req.params.id}).then(() => {
        res.redirect('/admin/categories')
    })
    
})
router.delete("/link/:id", (req, res)=> {
    Post.remove({_id: req.params.id}).then(() => {
        res.redirect('/admin/link')
    })
    
})
module.exports = router
const express = require("express");
const router = express.Router();
const User = require("../models/user");
router.get("/register", function (req, res) {
  res.render("index/register");
});
router.post("/register", function (req, res) {
  User.create(req.body, (error, user) => {
    res.redirect("/");
  });
});

router.get("/login", function (req, res) {
  res.render("index/login");
});
router.post("/login", function (req, res) {
  const {email, password} = req.body
  User.findOne({email}, (error, user) => {
    if (user) {
      if (user.password == password) {
        req.session.userId=user._id
        res.redirect("/");
        console.log("başarılı")
      } else {
        res.redirect("/users/login");
        console.log("şifre yanlıs")
      }
    } else {
      res.redirect("/users/register");
      console.log("üyelik yanlış")
    }
  });
});
router.get("/logout", function (req, res) {
  req.session.destroy(()=>{
    res.redirect("/");

  }
  )
});
module.exports = router;

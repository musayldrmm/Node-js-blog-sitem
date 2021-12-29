const express = require("express");
var exphbs = require("express-handlebars");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride=require('method-override');
const limit=require('./helpers/limit').limit
const generateDate=require('./helpers/generatedate').generateDate
const truncate= require('./helpers/truncate').truncate
const paginate=require('./helpers/pagination').paginate
mongoose
  .connect(
    `mongo connect link`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true, //this line is not mandatory
    }
  )
  .then(() => {
    console.log("Connected to MongoDB Cloud :)");
  }); //catch errors if you want.
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
//mongoose.set('useCreateIndex', true);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json

app.use(bodyParser.json());

app.use(fileUpload());
app.use(express.static("public"));
app.use(methodOverride('_method'));

const hbs=exphbs.create({
  helpers:{
    generateDate:generateDate,
    limit:limit,
    truncate:truncate,
    paginate:paginate
  }
})
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(
  session({
    secret: "test",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://sunsetistaken:eDNAID76uX3GMMGU@cluster0.0uprb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    }),
  })
);

app.use((req, res, next) => {
  const {userId} = req.session
  
  if (userId) {
    res.locals = {
      displayLink: true,
    }
    if(userId=="618e78418308f66aef0e53e8"){
      res.locals={
        admin:true,
        displayLink: true,
      }
    }

  } else {
    res.locals = {
      displayLink: false,
    }
  }

  next()
})




const main = require("./routes/main");
const posts = require("./routes/posts");
const users = require("./routes/users");
const admin= require("./routes/admin/index");
const contact=require('./routes/contact')
app.use("/", main);
app.use("/posts", posts);
app.use("/users", users);
app.use("/admin",admin);
app.use("/contact",contact)

/*   const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
  });  Heroku deployment için gerekli.
   */
  const port = 8080; //lokalde çalıştırmak için kullan
const hostname = "127.0.0.1";
app.listen(port, hostname, () => {
  console.log(`Example app listening at http://${hostname}:${port}`);
});  
 
    
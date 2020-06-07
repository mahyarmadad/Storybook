require("dotenv").config();
const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");

require("./models/User");
mongoose
  .connect(process.env.MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
require("./Oauth")(passport);
const app = express();
const port = process.env.PORT || 5000;
const auth = require("./routes/auth");
app.get("/", (req, res) => res.send("Wlcome to Home Page"));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
app.use("/auth", auth);

app.listen(port, () => console.log(` Server Started on port ${port}!`));

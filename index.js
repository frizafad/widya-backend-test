const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const db = require("./config/keys").mongourl;

const users = require("./routes/api/users");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose.connect(db, {useNewUrlParser:true},function(err) {
    if (err) throw err;
    console.log("Database Connected Success")
})

app.use(passport.initialize());
require("./config/passport")(passport);


app.use("/api/users", users);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server runing on PORT: ${PORT}`));
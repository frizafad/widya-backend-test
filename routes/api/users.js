const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const keys = require("../../config/keys");


const User = require("../../models/User");

router.post("/register", (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ error: "Email sudah ada" });
        } else {
            const newUser = new User({
                nama: req.body.nama,
                email: req.body.email,
                jenis_kelamin: req.body.jenis_kelamin,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                });
            });
        }
    });
});

router.post("/login", (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
    .then(user => {
        if (!user) {
            return res.status(404).json({ error: "Email belum terdaftar"});
        }

    bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
  
            const payload = { id: user.id, name: user.name }; 

            jwt.sign(payload,keys.secretKey,{ expiresIn: 360 },(err, token) => {
                res.json({
                    success: true,
                    data : user,
                    token: "Bearer " + token,
                    noted : "token will expire in 6 minutes"
                });
            });
        } else {
            return res.status(400).json({ error: "Password salah!" });
        }
    });
})
    .catch(err => console.log(err));
});

router.get("/jwtauth",passport.authenticate("jwt", {session: false}),
    (req, res) => {
        res.json({
            nama: req.user.nama,
            email: req.user.email,
            jenis_kelamin: req.user.jenis_kelamin
        });
    }
);


module.exports = router;
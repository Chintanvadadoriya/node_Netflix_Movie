const router = require("express").Router()
const User = require("../models/User")
var CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")


// REGISTER

router.post('/register', async (req, res,next) => {


     const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: CryptoJS.AES.encrypt(req.body.password.toString(),"chintan").toString()

     })

     try {
          const user = await newUser.save()
          res.status(201).json(user)
     } catch (err) {
          next(err);
          // res.status(500).json(err)
     }


})

//  LOGIN

router.post('/login', async (req, res,next) => {
     try {
          const user = await User.findOne({ email: req.body.email })

          !user && res.status(404).json("Worg email !")

          const bytes = CryptoJS.AES.decrypt(user.password, "chintan");

          var originalPassword = bytes.toString(CryptoJS.enc.Utf8);

          originalPassword !== req.body.password.toString() && res.status(404).json("Worg password !")
          const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin, email: user.email }, "chintan", { expiresIn: "365d" })

          const { password, ...info } = user._doc;

          res.status(200).json({ ...info, accessToken, msg: "user successfull login" })
     } catch (err) {
          next(err);
          // console.log(err, "Login Catch");
          // res.status(500).json(err)
     }
})

module.exports = router
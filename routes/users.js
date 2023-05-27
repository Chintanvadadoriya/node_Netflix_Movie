const router = require("express").Router()
const User = require("../models/User")
var CryptoJS = require("crypto-js");
const verify = require("../varifyToken")

//UPDATE

router.put('/:id', verify, async (req, res) => {
     if (req.user.id === req.params.id || req.user.isAdmin) {
          if (req.body.password) {
               req.body.password = CryptoJS.AES.encrypt(req.body.password.toString(), process.env.SECRET_KEY).toString()
          }
          try {
               const Updateuser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
               res.status(200).json(Updateuser)

          } catch (err) {
               res.status(500).json("catch Update", err)
          }
     } else {
          return res.status(403).json("You can update only your account !")
     }
})


//DELETE

router.delete('/:id', verify, async (req, res) => {
     if (req.user.id === req.params.id || req.user.isAdmin) {

          try {
               await User.findByIdAndDelete(req.params.id)
               res.status(200).json("User has been deleted... !")

          } catch (err) {
               res.status(500).json("catch delete", err)
          }
     } else {
          return res.status(403).json("You can delete only your account !")
     }
})


//GET
router.get('/find/:id', async (req, res) => {

     try {
          const user = await User.findById(req.params.id)
          res.status(200).json(user)

     } catch (err) {
          res.status(500).json("catch get", err)
     }

})
// GET ALL

router.get('/', verify, async (req, res) => {
     const query = req.query.new;
     if (req.user.isAdmin) {
          try {
               const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find()
               res.status(200).json(users)

          } catch (err) {
               res.status(500).json("catch get all user", err)
          }
     } else {
          return res.status(403).json("You are not allow to see all user !")
     }
})


//GET USER STATS

router.get('/stats', async (req, res) => {
     const today = new Date();
     const lastYear = today.setFullYear(today.setFullYear() - 1);

    
     try{
          const data =await User.aggregate([
               {
                    $project:{
                         month:{$month: "$createdAt"}
                    },
               },
               {
                    $group:{
                         _id:"$month",
                         total:{$sum:1}
                    }
               }
          ])
          res.status(200).json(data)

     }catch(err){
          res.status(500).status("catch get user stats",err)
     }
})


module.exports = router
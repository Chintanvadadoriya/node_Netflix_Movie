const router = require("express").Router()
const List = require("../models/List")
var CryptoJS = require("crypto-js");
const verify = require("../varifyToken")

//CREATE

router.post('/list', verify, async (req, res,next) => {
     if (req.user.isAdmin) {
          const newList = new List(req.body)
          try {
               const saveList = await newList.save()
               res.status(201).json(saveList)
          } catch (err) {
               next(err);

               // res.status(500).json('catch newlist', err)
          }

     } else {
          return res.status(403).json("You are not allow !")
     }
})

//DELETE

router.delete('/:id', verify, async (req, res,next) => {
     if (req.user.isAdmin) {
          try {
               await List.findByIdAndDelete(req.params.id)
               res.status(201).json("The list has been deleted.. !")
          } catch (err) {
               next(err);
               // res.status(500).json('catch delete list', err)
          }

     } else {
          return res.status(403).json("You are not allow !")
     }
})

// GET

router.get('/', verify, async (req, res,next) => {
     
     const typeQuery = req.query.type;
     const genreQuery = req.query.genre;
     let list = []

     try {
          if (typeQuery) {
               if (genreQuery) {
                    list = await List.aggregate([
                         { $sample: { size: 30 } },
                         { $match: { type: typeQuery, genre: genreQuery } }
                    ])
               } else {
                    list = await List.aggregate([
                         { $sample: { size: 30 } },
                         { $match: { type: typeQuery } }
                    ])

               }

          } else {
               list = await List.aggregate([{ $sample: { size: 30 } }])
          }
        res.status(200).json(list)
     } catch (err) {
          next(err)
          // res.status(500).json(err)
     }
})

module.exports = router
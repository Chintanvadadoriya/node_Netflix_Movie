const router = require("express").Router()
const Movie = require("../models/Movie")
var CryptoJS = require("crypto-js");
const verify = require("../varifyToken")

//CREATE

router.post('/movie', verify, async (req, res) => {
     if (req.user.isAdmin) {
          const newMovie = new Movie(req.body)
          try {
               const saveMovie = await newMovie.save()
               res.status(201).json(saveMovie)
          } catch (err) {
               res.status(500).json('catch newmovie', err)
          }

     } else {
          return res.status(403).json("You are not allow !")
     }
})

//UPDATE

router.put('/:id', verify, async (req, res) => {
     if (req.user.isAdmin) {
          try {
               const UpdateMovie = await Movie.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
               res.status(200).json(UpdateMovie)
          } catch (err) {
               res.status(500).json('catch newmovie update', err)
          }

     } else {
          return res.status(403).json("You are not allow !")
     }
})


//DELETE

router.delete('/:id', verify, async (req, res) => {
     if (req.user.isAdmin) {
          try {
               await Movie.findByIdAndDelete(req.params.id)
               res.status(200).json("The movie has been deleted !")
          } catch (err) {
               res.status(500).json('catch newmovie delete', err)
          }

     } else {
          return res.status(403).json("You are not allow !")
     }
})

//GET 

router.get('/find/:id', verify, async (req, res) => {
     try {
          const Movies = await Movie.findById(req.params.id)
          res.status(200).json(Movies)
     } catch (err) {
          res.status(500).json('catch newmovie get', err)
     }
})

//GET RENDOM

router.get('/random', verify, async (req, res) => {
     const type = req.query.type;
     let movie;
     try {
          if (type === "series") {
               movie = await Movie.aggregate([
                    { $match: { isSeries: "true" } },
                    { $sample: { size: 1 } },
               ]);
          } else {
               movie = await Movie.aggregate([
                    {$match: {isSeries: "false"}},
                    {$sample: {size: 1}}
               ]);
          }
          res.status(200).json(movie)
     } catch (err) {
          res.status(500).json('catch rendom', err)
     }


})

//GET ALL MOVIE

router.get('/', verify, async (req, res) => {
     try {
          const Movies = await Movie.find()
          res.status(200).json(Movies.reverse())
     } catch (err) {
          res.status(500).json('catch all movie get', err)
     }
})
module.exports = router
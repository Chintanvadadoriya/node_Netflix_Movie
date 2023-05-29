const express =require("express")
const app =express()
const dotenv = require('dotenv')
const authRoute =require("./routes/auth")
const usersRoute =require("./routes/users")
const movieRoute =require("./routes/movie")
const listRoute =require("./routes/list")
const mongoose =require("mongoose")
var cors = require('cors')
dotenv.config({path:process.env.MONGO_URL})
app.use(cors());

console.log(typeof(process.env.MONGO_URL));
const db=async()=>{
     try{
          mongoose.set("strictQuery", false);

         await mongoose.connect(process.env.MONGO_URL,
               (err) => {
                    if (err) {
                         console.log('err on cloud mongoose :>> ', err);
                    } else {
          
                         console.log('connection cloud !!!');
                    }
               
          });
     }catch(err){
          console.log("db",err);
     }
}

db()

app.use(express.json());


app.use("/api/auth",authRoute)
app.use("/api/users",usersRoute)
app.use("/api/movies",movieRoute)
app.use("/api/lists",listRoute)



app.listen(5000,()=>{
     console.log("Server is running on 5000 ! Port");
})

const express =require("express")
const app =express()
const dotenv = require('dotenv')
const authRoute =require("./routes/auth")
const usersRoute =require("./routes/users")
const movieRoute =require("./routes/movie")
const listRoute =require("./routes/list")
const mongoose =require("mongoose")
var cors = require('cors')
dotenv.config()
app.use(cors());

mongoose.connect(process.env.MONGO_URL,{
     useNewUrlParser: true,
     useUnifiedTopology: true
     }).then(()=>console.log("DB connected Successfull !")).catch((err)=>console.log("Errorr Connect Db",err));

app.use(express.json());


app.use("/api/auth",authRoute)
app.use("/api/users",usersRoute)
app.use("/api/movies",movieRoute)
app.use("/api/lists",listRoute)



app.listen(5000,()=>{
     console.log("Server is running on 5000 ! Port");
})

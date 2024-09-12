// require('dotenv').config({path: './env'})

// alternate of above 
import dotenv from "dotenv";
import express from 'express';
import connectDB from "./db/index.js";

// This is the part of the first import statement
dotenv.config({
    path: './.env'
})

const app = express();
// It returns a Promise thats why we use then and catch here and also we connect it with the port 
connectDB()
.then(()=>{
    
    //  This is for communication check on PORT 
     app.on("error",()=>{
          console.log("Error: ", error);
          throw error;
     })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`\n Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGODB connection failed!!",err)
})





/*
import express from "express"

const app = express();

;(async ()=>{
 try{
    // This is to connect the Data Base
     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    //  This is for communication check on PORT 
     app.on("error",()=>{
          console.log("Error: ", error);
          throw error;
     })

     app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`);
     })
 }
 catch (error){
       console.log("ERROR: ", error);
       throw error;
 }
})()
 */
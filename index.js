import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import connectDB from "./config/db.js";
import User from "./models/registerSchema.js"

dotenv.config();

const app = express()
connectDB()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',(req,res)=>{
     res.send('Home Page')
});


app.listen(3000,()=>{
     console.log('port running on 3000')
});
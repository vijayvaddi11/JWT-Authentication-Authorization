import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import connectDB from "./config/db.js";
import User from "./models/registerSchema.js"
import verifyToken from "./middleware/verifyTokenMiddleware.js";

dotenv.config();

const app = express()
connectDB()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())





app.get('/',(req,res)=>{
     res.send('Home Page')
});

app.post('/register', async(req, res) => {
     try{
          const {username,email,password} = req.body
     //user validation
     if (!username?.trim()||
          !email?.trim()||
          !password.trim()){
          return res.status(400).json({message:"require valid user details"})
     }
     
     //checking for valid email and password length
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     if (!emailRegex.test(email.trim())) {
          return res.status(400).json({ message: "Invalid email" });
     }

     if (password.trim().length<6){
          return res.status(400).json({message:"Password must be at least 6 characters"})
     }

     //check user and email alredy exist or not
     const checkUserAndEmail = await User.findOne({ $or :[{username},{email}]})

     if (checkUserAndEmail){
          return res.status(400).json({message:"username or email already Exist"})
     }



     //hash password
     const hashedPassword = await bcrypt.hash(password,10)

     const user = new User({
          username,
          email,
          password:hashedPassword
     })
     await user.save()

     return res.status(201).json({
          message:"user registered Successfully!"
     })

     }catch(err){
          res.status(500).json({
               message:"Server Error",
               error:err.message
          })
     }
     

});



app.post('/login', async(req, res)=>{
     try{
     const {email,password} = req.body

     const existingUSer = await User.findOne({email})

     if (!existingUSer){
          return res.status(400).json({message:"Email or Password is worng"})
     }

     const match = await bcrypt.compare(password, existingUSer.password);

     if (!match){
          return res.status(400).json({message:"Email or Password is worng"})
     }

     const accessToken = jwt.sign(
          {userId:existingUSer._id,
          username:existingUSer.username,
          },
          process.env.JWT_SECRET,
          {expiresIn:'15m'}
               );

     

     const refreshToken = jwt.sign(
          {userId:existingUSer._id,
          username:existingUSer.username
          },
          process.env.JWT_SECRET,
          {expiresIn:"7d"}
     );

     existingUSer.refreshToken = refreshToken;
     await existingUSer.save();
     
     return res.status(200).json(
          {message:'User Login Successfull',
          accessToken:accessToken,
          refreshToken:refreshToken
          });

     }catch(err){
          res.status(500).json({
               message:"Server Error",
               error:err.message
          })
     }
});


app.post('/refresh-token', async (req, res) => {
     const { refreshToken } = req.body;

     if (!refreshToken) {
     return res.status(401).json({ message: "Refresh token missing" });
     }

     try {
     // Check token valid or not
     const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

     // Check token exists in DB
     const user = await User.findById(decoded.userId);

     if (!user || user.refreshToken !== refreshToken) {
          return res.status(403).json({ message: "Invalid refresh token" });
     }

     // Generate new access token
     const newAccessToken = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "15m" }
     );

     res.json({
          accessToken: newAccessToken
     });

     } catch (err) {
     res.status(403).json({ message: "Refresh token expired or invalid" });
     }
});


app.get('/profile',verifyToken,(req,res)=>{
     const name = req.username;
     return res.status(200).json({message:`welcome ${name}`})
})





app.listen(3000,()=>{
     console.log('port running on 3000')
});
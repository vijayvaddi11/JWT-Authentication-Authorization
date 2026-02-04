import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config() 

const verifyToken =(req,res,next)=>{
     const authHeader = req.headers.authorization;

     if(!authHeader){
          return res.status(401).json({message:'Token missing'})
     }

     const token = authHeader.split(" ")[1];

     try{
          const decoded = jwt.verify(token,process.env.JWT_SECRET)
          console.log(decoded)
          req.userId = decoded.userId;
          req.username = decoded.username;
          next();

     }catch(err){
          return res.status(401).json({ message: "Invalid token" });
     }

     

}

export default verifyToken;
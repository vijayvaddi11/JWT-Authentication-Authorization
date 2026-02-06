import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const connectDB =async()=>{
     try{
          await mongoose.connect(`${process.env.MONGODB_URI}`)
          console.log('database Connected Sucess!')
     }catch(err){
          console.log('failed connecting database',err)
     }
}

export default connectDB;

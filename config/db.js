import mongoose from "mongoose";

const connectDB =async()=>{
     try{
          await mongoose.connect('mongodb://127.0.0.1:27017/login')
          console.log('database Connected Sucess!')
     }catch(err){
          console.log('failed connecting database',err)
     }
}

export default connectDB;

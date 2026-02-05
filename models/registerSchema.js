import mongoose from "mongoose";
const {Schema} = mongoose;

const userRegisterSchema = new Schema({
     username:{
          type:String,
          required: true,
          unique: true
     },
     email:{
          type:String,
          required:true,
          unique:true
     },
     password:{
          type:String,
          required:true
     },
     refreshToken:{
          type: String
     }
},{timestamps:true})

export default mongoose.model('User',userRegisterSchema)
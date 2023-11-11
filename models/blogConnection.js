const mongoose=require("mongoose");
const BlogSchema=new mongoose.Schema({
 title:{
    type:String,
    trim:true,
 },
 description:{
    type:String,
    trim:true,
    unique:true,
},
image:{
   type:String,
   trim:true
}
})

const blogModel=new mongoose.model("bloglist",BlogSchema)
module.exports=blogModel;
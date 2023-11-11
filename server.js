const dotenv=require("dotenv");
dotenv.config();
const mongoose=require("mongoose");
const express=require("express");
const cors=require("cors");
const userModel=require('./models/userconnection')
const jwt=require("jsonwebtoken");
const blogModel = require("./models/blogConnection");
const app=express();
const middleware=require("./midddleware")


app.use(express.json());
app.use(cors());

const DB_URL=process.env.DB_URL;
mongoose.connect(DB_URL).then((db,err)=>{
    try{
        console.log("connected to server")
    }catch(e){
        console.log(e);
    }
});
//email validation//
let regex =
/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
//email validation in terminal//
// const email = "a"
// console.log(regex.test(email))
//post route//
app.post('/register',async(req,res)=>{
    try{
        const{username,email,password,confirmpassword}=req.body
        let emailValid=regex.test(email);
        console.log("emailvalid ?",emailValid)
        let exists=await userModel.findOne({email})
        if (exists){
            return res.status(400).json({message:"email is already there"})
        }else if(username==""){
            return res.status(400).json({message:"username is requried"})
        }else if(email==""){
            return res.status(400).json({message:"eamil is requried"})
        }else if(!emailValid){
            return res.status(400).json({message:"eamil is not valid"})  
        }
        else if(password==""){
            return res.status(400).json({message:"password is requried"})
        }else if( confirmpassword==""){
            return res.status(400).json({message:"confirmpassword is requried"});
        }else if(password!== confirmpassword) {
            return res.status(400).json({message:"password is incorrect"})
        }
        else{
            await userModel.create(req.body);
            return res.status(200).json({message:"registers sucessfully"})
        }
    }catch(e){
        console.log(e)
    }
})
//login user//
app.post("/login",async(req,res)=>{
    try{
        const{email,password}=req.body
        let exists=await userModel.findOne({email});
        if(!exists){
            return res.status(404).json({message:"email is not existed"})
        }else if (email == ""){
            return res.status(404).json({message:"email is required"})
            
        }else if (password ==""){
            return res.status(404).json({message:"password is required"}) 
        }
        else if(exists.password !==password){
            return res.status(404).json({message:"password is not correct"})
        }else{
            const payload={
                user:{
                      id:exists.id
                },
            };
         jwt.sign(payload,"jwtSecret",{expiresIn:"10m"},async(err,token)=> {
          try { 
            if (err)throw err;
            else{
                await res.json({token});
            }
          }
          catch(e){
            console.log(e)
          }
         })
        }

    }catch(e){
        console.log(e);
    }
})
///api//

app.get("/blog",middleware,async(req,res)=>{
    try{
    let exist=await userModel.findById(req.user.id)
    if (!exist){
        return res.status(200).send(allBlogs)
    }else{
        const allBlogs=await blogModel.find({});
        return res.status(200).send(allBlogs)
    }
    }catch(e){
        console.log(e)
    }

})

app.post("/addBlog",async(req,res)=>{
    try{
        const {title,description,image}=req.body;
        await blogModel.create(req.body);
        return res.status(200).json({message:"blog is posted"})
    }catch(e){
        console.log(e)
    }

})
app.patch("/addBlog/:id",async(req,res)=>{
    try{
        const updateres = await blogModel.findByIdAndUpdate(req.params.id,req.body);
        return res.status(200).send({updateres,m:"updated"});
    }catch (e){
        console.log(e)
    }
})

app.delete("/delete/:id",async(req,res)=>{
    try{await blogModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({message:"Blog is Deletd"});

    }catch (e){
        console.log(e)
    }
});

app.listen(7000,()=>{
    console.log("connected")
})
const jwt=require("jsonwebtoken")
module.exports=async(req,res,next)=>{
    try{
        let token=await req.header("x-token")
        if(!token){
            return res.status(404).send("token not found")
        } 
        let decode=jwt.verify(token,"jwtSecret");
        req.user=decode.user;
        next();
    }catch(e){
        return res.status(500).send("Internal server error")
    }
};
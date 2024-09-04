var jwt=require('jsonwebtoken')
require('dotenv').config()
const JWT_Secret=process.env.SECRET_KEY;//this is my token signature
const fetchuser=(req,res,next)=>{
   const token=req.header('auth-token');
   if(!token)
    {
        res.status(401).send({error:"please authenticate using valid token"});
    }
    try{
      const data=jwt.verify(token,JWT_Secret);//
      req.user=data.user; //Since the payload of the token contains the user object ({ user: { id: user.id } }), data.user extracts this user object. 
                           //After successful verification, the user data from the token's payload (which is stored in data.user) is assigned to req.user. This effectively adds the user property to the req object. 
      next();
    }catch(error){
        res.status(401).send({error:"please authenticate using valid token"});
    }
}
module.exports=fetchuser
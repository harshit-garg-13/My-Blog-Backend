const express = require('express');
const router = express.Router();
const User = require('../models/User')
const {body,validationResult}=require('express-validator');//to validate the data given by user
const bcrypt = require('bcryptjs')//for doing hashing in password
var jwt=require('jsonwebtoken');//for generating token
var fetchuser=require('../middleware/fetchuser')
require('dotenv').config()
const JWT_Secret=process.env.SECRET_KEY;//this is my token signature

router.post('/createuser',[body('name','Enter a valid name').isLength({min:3}),
    body('email').isEmail(),
    body('password').isLength({min:5}),
],async(req,res)=>{
    let success=false;
    //  const user=User(req.body);
    //  user.save();
    // console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success,errors:errors.array()});
    }
    try{
    let user=await User.findOne({email:req.body.email});
    if(user)
        {
            return res.status(404).json({success,error:"Email already exist"});
        }
        //doing hashing and salting
     const salt=await bcrypt.genSalt(10);
     const secPass=await bcrypt.hash(req.body.password,salt);

    user=await User.create({      //if i done some typo error then catch will run
        name:req.body.name,
        password:secPass,
        email:req.body.email,
    })

    const data={             //this is the data which user token contain ,since id is different for different users
     user:{
       id:user.id
     }
    }
    success=true;
    const authtoken= jwt.sign(data,JWT_Secret);

    
    // .then(user=>res.json(user))
    // .catch((err)=>{console.log(err) 
    //     res.json({error:"Email already exist"});
    // })
   // res.send("hello");
   res.json({success,authtoken});
}catch (error){
    console.error(error.message);
    res.status(500).send("some error occurs");
}
})

//Login Authetication
router.post('/login',[body('email','Enter valid Email').isEmail(),
                           body ('password','Password cannot blank').notEmpty()],async(req,res)=>{
                            let status=false;
                            const errors=validationResult(req);
                            if(!errors.isEmpty())
                                {
                                    return res.status(400).json({status:status,errors:errors.array()})
                                }
                            const {email,password}=req.body;
                            try{
                            let user=await User.findOne({email});
                            if(!user)
                                {
                                    return res.status(400).json({status:status, error:"Invalid Credential"});
                                }
                            const passCompare=await bcrypt.compare(password,user.password);
                            if(!passCompare)
                                {
                                    return res.status(400).json({status:status, error:"Invalid Credential"});
                                }

                                const data={
                                    user:{
                                        id:user.id
                                    }
                                }
                                const authtoken=jwt.sign(data,JWT_Secret);
                                res.send({status:true,authtoken});
                           }catch(error){
                            console.error(error.message);
                            res.status(500).send("Internal Server Error");
                           }
                        }
                        
                        )

 //router 3 
 router.post('/getUser',fetchuser,async(req,res)=>{
    try{
       const userId=req.user.id;
        const user=await User.findById(userId).select("-password");
        res.send(user);
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
       }
 })                      

module.exports = router
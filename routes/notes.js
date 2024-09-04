const express = require('express');
const router = express.Router();
var fetchuser=require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//for fetching Notes of User
router.get('/fetchallnotes',fetchuser, async(req,res)=>{
   try{  const notes=await Notes.find({user:req.user.id}); //  user: req.user.id  mean that search on the basis of user: req.user.id in the database, if this match then return data corresponds to this
   
    res.json(notes);
}catch(errors){
    console.error(errors.message);
    res.status(500).send("Some Internal Server Error")
}
})

//Add notes 

router.post('/addnotes',fetchuser,[body('title','Enter valid title').isLength({min:3})
    ,body('description','Enter Valid Description').isLength({min:3})], async(req,res)=>{
        try {
            const {title,description,tag}=req.body;
             const errors=validationResult(req);
             if(!errors.isEmpty()){
                return res.status(400).json({errors:errors.array()});
             }
             const note=new Notes({
                title,description,tag,user:req.user.id  //  user: req.user.id  line means that req.user.id is explicitly assign to user in notes schema 

             })
             const savedNotes=await note.save();
             res.json(savedNotes);
            
        } catch(errors){
    console.error(errors.message);
    res.status(500).send("Some Internal Server Error")
}

//update an existing note
router.put('/updatenote/:id',fetchuser,async(req,res)=>{
    const {title,description,tag}=req.body;
    const newNote={};
    if(title){newNote.title=title}
    if(description){newNote.description=description}
    if(tag){newNote.tag=tag}

    let note=await Notes.findById(req.params.id);   //findById returns a document (note) that matches the provided ID. This document is a JavaScript object representing the note, including its fields like title, description, tag, and user.
    if(!note){
       return  res.status(404).send("No user found");
    }
    if(note.user.toString()!==req.user.id) //note.user.toString() converts the ObjectId to a string. This step is crucial because req.user.id is a string, and you can only directly compare two strings.
{
    return res.status(401).send("Not Allowed");
}
note =await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
res.json({note});
    
})

//Delete an existing note
router.delete('/delete/:id',fetchuser,async(req,res)=>{


    let note=await Notes.findById(req.params.id);   //findById returns a document (note) that matches the provided ID. This document is a JavaScript object representing the note, including its fields like title, description, tag, and user.
    if(!note){
       return  res.status(404).send("No user found");
    }
    if(note.user.toString()!==req.user.id) //note.user.toString() converts the ObjectId to a string. This step is crucial because req.user.id is a string, and you can only directly compare two strings.
{
    return res.status(401).send("Not Allowed ,Delete you notes only");
}
note =await Notes.findByIdAndDelete(req.params.id);
res.json({"success":"sucessefully deleted",note:note});
    
})

    })
module.exports = router
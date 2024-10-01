const mongoose=require("mongoose");
require('dotenv').config()
async function connectToMongo() {
    await mongoose.connect(process.env.MONGO_URL).then(()=> console.log("Connected to Mongo Successfully")).
    catch(err => console.log(err));
  }
  
  module.exports = connectToMongo;
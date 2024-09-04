const mongoose=require("mongoose");
require('dotenv').config()
//const mongoURI="mongodb+srv://abhipal7500:Abhipal7500@cluster0.x07znkw.mongodb.net/inotebook?retryWrites=true&w=majority&appName=Cluster0";
async function connectToMongo() {
    await mongoose.connect(process.env.MONGO_URL).then(()=> console.log("Connected to Mongo Successfully")).
    catch(err => console.log(err));
  }
  
  module.exports = connectToMongo;
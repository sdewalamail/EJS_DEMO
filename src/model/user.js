

  const mongoose = require('mongoose');


   const userSchema = new mongoose.Schema({
       
      userName: {
         type: String,
         require: true,
         min: 3,
         unique: true
      },
      userPassword: {
         type: String,
         require: true,
         min: 3
      }, 
      token:{
        type:String,
        require: true,

      }, 
      "profilePic": {type: String, default: null}
    
    
   });

    module.exports = mongoose.model("user", userSchema)
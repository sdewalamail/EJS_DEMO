

  const mongoose = require('mongoose');
  const bcrypt = require("bcrypt");


   const userSchema = new mongoose.Schema({
       
      "firstName": {
         type: String,
         required: true,
      },
      "lastName": {
         type: String,
         required: true,
         
      },
      "email":{
         type: String,

         // validate: {
         //    validator: function(v) {
         //      return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v);
         //    },
         //    message: props => `${props.value} is not a valid phone number!`
         //  },
            required: [true, 'User email number required'],
            unique: true
      },
       "phone":{
        type:String,
        required: true
      }, 
      "password":{ 
         type: String,
      },
      "designation": String,

      "countryCode": String,

      "profilePic": {type: String, default: null}
    
    
   });

     userSchema.pre("save",  async function (next) {

       if(!this.isModified('password')) {
             
         return next();
      };

      const user = this;


         try {
            
           const hash =  await bcrypt.hash(user.password,5);
         //   console.log(hash);
            user.password = hash;
             return next();

         } catch (error) {

            return next(error);
           
         }
     })




    module.exports = mongoose.model("user", userSchema)
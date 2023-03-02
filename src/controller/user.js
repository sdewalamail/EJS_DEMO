
        const user = require('../model/user');

         const logIn   = (req, res, next) =>  {
             const {body} = req;
             const {validationError} = req  ;
             console.log("Erroor::::::::::::::::",validationError);

             if(validationError){

                res.render("login",{message:{error:validationError?.message},state:req.body}); 
             }else{

                 res.json({ Token:`Bearer ${req.token}`, "login":  "Successfully"});
                 
             }

       }
    
      const signup = async (req, res, next) => {

         const {body} = req;
        //  console.log(body);
        const {validationError} = req  ;
        if(validationError){

            res.render("signup",{message:{error:validationError?.message},state:req.body}); 
         } else {

            await user.create({
                'firstName':body.firstName,
                'lastName':body.lastName,
                'email': body.email,
                'phone': body.phoneNumber,
                'password': body.password,
                'designation': body.designation,
                'countryCode' : body.countryCode
      
               });

               res.json({user: "Successfully created"});

         }
        
       
   };


       const uploadProfilePicture  = async (req, res, next) => {
            try {
            
            
            const userName = req.params.name;
        
            // check extension
        
            if (!req.file) {
                return res.status(400).json({
                description:
                    "please give an appropriate image formate.eg ['.jpg','.png', '.gif', '.webp', '.bmp']",
                });
            }
        
            // Find the item to upload

            const validUser = await user.findOne({userName: userName});
            console.log(validUser);
        
            // if given user doesn't exists the rm remove the uploaded image

            
            if (validUser == null ) {
                await fs.rm( path.join (`${uploadPath}` , req.file.filename) );
                return res.status(404).json({ description: "User not found" });
            }
        
            // console.log();



            // if user have already set the profilePic then remove the previous and upload the new pic logic
        
            try {
                if (validUser.profilePic ) {
                let test =  await fs.rm(path.join(process.cwd(),"src", `${validUser.profilePic}`));
                }
            } catch (error) {
                console.log(error);
                if (!(error.code === "ENOENT")) {
                throw error;
                }
            }
        
            const updatedUser  = await user.findOneAndUpdate({userName},{$set:{profilePic: path.join("public","images", "profile_pic", req.file.filename)}})
            
            await updatedUser.save();
            res.json(updatedUser);
            //  console.log("Old user>>>>>>>>>>>> ", updatedUser);
            
            } catch (error) {
            console.log(error);
            res.status(500).send("Server error");
            }

        
  }


     module.exports = {logIn, signup, uploadProfilePicture};



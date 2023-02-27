const express = require('express');
const Joi = require('joi');
const router = express.Router();
const bcrypt = require('bcrypt')

const bodyValidator = require('../middleware/validation')
const tokenGenerator = require('../auth/tokenGenerator');
const user = require('../model/user');

const multer = require('multer');
const path = require('path');
const fs = require('fs/promises')

const uploadPath = path.join(process.cwd(), "src" , "public", "images" , "profile_pic" );

function fileFilter(req, file, callback) {
  try {
    const acceptedExtension = [".jpg", ".png", ".gif", ".webp", ".bmp"];
    const fileExtension = path.extname(file.originalname).toLocaleLowerCase();
    console.log(fileExtension);
    callback(null, acceptedExtension.includes(fileExtension));
  } catch (error) {
    callback(error);
  }
}; 

 const storage = multer.diskStorage({
    destination:function(req, file, callback) {
    callback(null, uploadPath);
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  },
 });

 const uploads = multer({
  storage: storage,
  limits: {
    fieldSize: 2 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});




/* GET users listing. */



  const schema = Joi.object({

    "name": Joi.string().min(3).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    "password": Joi.string().required() .pattern(/^(?=.*[A-Za-z])(?=.*[\d])(?=.*[@#$])[\w@#$]{4,}$/)
  })



router.post('/', async(req, res) => {
    const users = await user.findOne({userName:req.body.name})
          // console.log("heoo");
       res.send(users)
      
})


router.post('/login', bodyValidator(schema) ,tokenGenerator ,(req, res, next) =>  {
   
          res.send({Token:`Bearer ${req.token}`});   
          //  res.render("index");
          //  res.json({"login":  "Successfully"})
    
});

router.post('/signup', bodyValidator(schema), async (req, res, next) => {


    const hashedPassword =  await bcrypt.hash(req.body.password,4)
      
     await user.create({
      userName: req.body.name, userPassword: hashedPassword })
      res.send({message: "userCreated" })
   });

   router.post('/uploadDP/:name', uploads.single("profilePic") , async (req, res, next) => {
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

        
  })


module.exports = router;



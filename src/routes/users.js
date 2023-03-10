const express = require("express");
const Joi = require("joi");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");

const bodyValidator = require("../middleware/joiValidation");
const tokenGenerator = require("../auth/tokenGenerator");
const user = require("../model/user");
// const {authenticate} = require("../middleware/passport");
const authenticate = require('../middleware/requireLogin')

const { logIn, signup, uploadProfilePicture } = require("../controller/user");
const { render } = require("../app");

const product = require('../model/productSchema')

// check file extension (MULTER)
function fileFilter(req, file, callback) {
  try {
    const acceptedExtension = [".jpg", ".png", ".gif", ".webp", ".bmp"];
    const fileExtension = path.extname(file.originalname).toLocaleLowerCase();
    console.log(fileExtension);
    callback(null, acceptedExtension.includes(fileExtension));
  } catch (error) {
    callback(error);
  }
}

//   After chek the extension provied  uploadPath through disStorage (multer)

const uploadPath = path.join(
  process.cwd(),
  "src",
  "public",
  "images",
  "profile_pic"
);

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadPath);
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

//  all thing good now upload the picture
const uploads = multer({
  storage: storage,
  limits: {
    fieldSize: 2 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

const loginSchema = Joi.object({
  email: Joi.string()
    .required()
    .pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  password: Joi.string()
    .required()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    ),
});

const signupSchema = Joi.object({
  firstName: Joi.string().min(3),
  lastName: Joi.string().min(3),
  email: Joi.string()
    .required()
    .pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  phoneNumber: Joi.string()
    .required()
    .min(10)
    .pattern(/^[5-9]\d{9}$/),
  designation: Joi.string().required(),
  countryCode: Joi.string().required(),
  password: Joi.string()
    .required()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    ),
  repeat_password: Joi.ref("password"),
});

//  Get Method
router.get("/login", (req, res, next) => {
  if(req.query['authError']){

    return res.render('login',{message: {"authError": req.query['authError']}, state:{} } );
 }

    res.render("login",{message:{}, state:{}})    
 
});

router.get("/", authenticate, async (req, res) => {

  
  res.render("index");
});


router.get("/signup", async (req, res, next) => {
  
  try {
    res.render("signup",{message:{}, state:{}})    

  } catch (error) {

      console.log(error);
  }

});


      //  Product route

    router.get('/product', authenticate ,async(req, res, next) =>  {
         const products =  await product.find({}).lean();
         const {message,deleteMessage} =req.query

        //  console.log(products);
         res.render('product', {message:{success:message, deleteMessage  }, state:{},data:Array.from(products)})

      });

      router.post('/product', authenticate ,uploads.single("productImage"),async(req, res, next) =>  {
        
         const data = product.create({

          "productName": req.body.productName ,
          "productDiscription": req.body.productDescription,
          "quantity": req.body.quantity,
          "productImage": path.join("public", "images", "profile_pic", req.file?.filename || " ").toString()
          

         });
         
         res.redirect(`product?message=Product Added Successfully`)

    });

     router.get("/deleteProduct/:id", async (req, res) => {
        const {id}= req.params;
          await product.deleteOne({_id:id});
          res.redirect("/product?deleteMessage=Product Deleted Successfully");
          
     })


router.get("/upload", async (req, res, next) => {
  res.render("imageUpload");
});

// router.get('*', async (req, res, next) => { res.render("error")});

//  post Method

router.post("/login", bodyValidator(loginSchema), tokenGenerator, logIn);

router.post("/signup", bodyValidator(signupSchema), signup);

router.post(
  "/uploadDP/:name",
  authenticate,
  uploads.single("profilePic"),
  uploadProfilePicture
);

module.exports = router;


const jwt = require('jsonwebtoken');
const user = require('../model/user');
const bcrypt = require('bcrypt')


module.exports =  async function validateUserAndGenerateToken (req,res, next)  {
   


    if(req.validationError){
        return next()
    }


    const userDatils =   await user.findOne({email:req.body.email});
    
    
    if(userDatils == null){
        return res.status(401).json({eroor: "User Id not exist"})
        
    };
      const isvalidPassword = await bcrypt.compare(req.body.password,userDatils.password);

      if(isvalidPassword) {

        const token = jwt.sign (
             {userName : req.body.email, userPassword: userDatils.password}
            , process.env.SECRET_KEY, {algorithm: "HS256", expiresIn: "90000121300"}
        )
       req.token = token; 
        // res.json{""}    
        next()
      }else{
        res.status(404).json({error: "user password wrong"})
      }       
      
}

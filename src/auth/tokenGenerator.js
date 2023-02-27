
const jwt = require('jsonwebtoken');
const user = require('../model/user');
const bcrypt = require('bcrypt')


module.exports =  async function validateUserAndGenerateToken (req,res, next)  {
   


    const userDatils =   await user.findOne({userName:req.body.name});
    
    
    if(userDatils == null){
        return res.status(401).json({eroor: "User Id not exist"})
        
    };
      const isvalidPassword = await bcrypt.compare(req.body.password,userDatils.userPassword)
      if(isvalidPassword) {

        const token = jwt.sign (
            {userName : req.body.name}, process.env.SECRET_KEY, {algorithm: "HS256", expiresIn: "90000121300"}
        )
        req.token = token;     
        next()
      }else{
        res.status(404).json({error: "user password wrong"})
      }
    


        

         
      
}

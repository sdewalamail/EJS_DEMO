const jwt = require('jsonwebtoken');
 require('dotenv').config();
 const user = require('../model/user')

function validator (req, res, next) {
   const token =  req.headers.authorization;
//    console.log(req.headers);
    
     if(req.path.endsWith('login')|| req.path.endsWith('signup')){
        next();
        return;
     }

    if(!token) return res.status("404").json("please enter bearer token");


          try {

            const decode = jwt.verify( token.slice(7),process.env.SECRET_KEY,)
            //  user.findOne({userName: decode.userName})
            //  if(decode.data.userName != user.userName )
            // console.log(decode.userName);
               return next();
          } catch (error) {
            
            console.log(error
);
            res.json({token: 'Expired'})
          }
}


module.exports = validator
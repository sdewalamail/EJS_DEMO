
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
// const ExtractJwt = passportJWT.ExtractJwt;
const bcrypt = require('bcrypt');

const User = require('../model/user');

const jwtOptions = {
  // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  jwtFromRequest: extractor,
  secretOrKey: process.env.SECRET_KEY,
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {

    
    const user = await User.findOne({email:payload.userName}).lean();
    console.log(payload, user);
    if (!user) {
      
      return done(null, false);
    }
     
      const isvalidPassword = payload.userPassword === user.password;

        console.log(isvalidPassword);

      if(isvalidPassword) return done(null, user);

      else return done(null, false);

  } catch (error) {
     console.log(error)
    return done(error, false);
  }
});

// custom cookie extractor _____________________>>>>>>>>>>>>>>>>>>

function extractor (req){

      let token = null;
      if(req && req.cookies){
        token = req.cookies['token']?.slice(7);
        console.log(req.cookies['token']?.slice(7));
      }  
      return token;
}


// passport.use(jwtStrategy);


 module.exports = jwtStrategy;
// module.exports = {
  // authenticate: passport.authenticate('jwt', { session: false }),}














// const jwtStrategy = require("passport-jwt").Strategy;
// const extractJwt = require("passport-jwt").ExtractJwt;
// const user = require('../model/user')
// const bcrypt = require('bcrypt');


// module.exports = function (passport) {
//   passport.use(

//     new jwtStrategy(
//       {
//         secretOrKey: process.env.SECRET_KEY,
//         jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
//       },
 
//         function (jwt_payload, done) {


//         console.log(jwt_payload)

//         user.findOne({ email: jwt_payload.email},async function (err, user) {

//               if (err) {
//                 return done(err, false);
//               }

//           if (user) {

//                const isvalidPassword = await bcrypt.compare(jwt_payload.password,user.password);

//                console.log(isvalidPassword);

            

//                  if(isvalidPassword)return done(null, user);



//           } else {
      
//             return done(null, false);
//             // or you could create a new account
//           }
//         });
//       }
//     )
//   );
// };

const passport = require('passport');


function requireToSignIn(req, res, next){

    passport.authenticate('jwt', {session: false}, (err, user, info ) => {

        if(err || !user) { 

            // console.log("::::::::::::: Auth needed ::::::::::::", info, err, user);

            return res.redirect(`/login?authError=please login first or session expired`);
        }
        return next()

    })(req, res, next);
};


module.exports = requireToSignIn;
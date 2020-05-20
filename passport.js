const passport= require('passport');
const LocalStrategy= require('passport-local').Strategy;
const User= require('./database').users;
const account_status= require('./database').account_status;

passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log('Inside LocalStrategy');
      User.findOne({  
        where: {
          username: username
        } 
      }).then((user)=>{
        if (!user) {
          console.log('user not found');
          return done(null, false, {message: "No such user"})
        }
        if (user.password !== password) {
          console.log('wrong password');
          return done(null, false, {message: "Wrong password"})
        }
        console.log('success');
        return done(null, user);

      }).catch((err)=>{
        console.log('error in login');
        return done(err);
      })
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.username);
  });

  passport.deserializeUser(function(username, done) {
    User.findOne({
        where: {
          username: username
        }
    }).then((user)=>{
        if(!user){
          return done(new Error('No such user'));
        }

        //checking for account status
        account_status.findOne({
          where: {
            username: username
          }
        }).then((account_user){
          if(!account_user){
            console.log('user not found');
            return done(null, false, {message: "No such user"});
          }

          if(account_user.status=="deactive"){
            console.log("The account has been deactivated by the admin");
            return done(null,false, {message: "deactive account"});
          } else {
            console.log("The account is active");
            return done(null, user);
          }
        }).catch((err)=>{
          return done(err);
        })

    }).catch((err)=>{
      return done(err);
    })
  });

  module.exports= passport;
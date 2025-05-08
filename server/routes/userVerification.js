const express = require('express');


const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10; 

var passport = require('passport');
var LocalStrategy = require('passport-local');
var session = require('express-session')


//...........................................custom passport authenticate middleware........................................................

router.post('/login/submit', (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return res.status(500).json({ message: "Internal server error" });
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
  
      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: "Login failed" });
        return res.json({ message: "Login successful", user });
      });
    })(req, res, next); 
  });




passport.use(new LocalStrategy(async function verify(username, password, cb) {
    console.log("username : ",username);
    try {
      const user_result = await getPassword(username);
     
      console.log("hashreasult ", user_result)
      if  (user_result.length === 0) {
        return cb(null, false);
      }
      const isMatch = await bcrypt.compare(password, user_result[0].password);
  
      
      if (!isMatch) {
        return cb(null, false);
      }
  
      const profilePhoto=await getUserProfilePic(username);
  
  
  
      console.log("user id in db <passport> ",user_result[0].id)
      return cb(null, { username:username ,profilephoto:profilePhoto ,user_id:user_result[0].id});
    } catch (err) {
      return cb(err);
    }
  }));


  
router.post("/register/action", upload.single('uploaded_file'),async (req,res)=>{
    let username = req.body.username
    console.log("getting the user fpor register",username)
   let response= await db.query("SELECT * FROM USERS WHERE gmail=$1",[username])
   if (response.rows.length!=0){
    return res.status(409).send("User already exists. Please log in.");
 }
 
 
 
  else {
   const hashedPassword = await bcrypt.hash(req.body.password, 10);
     const newUser= await addUser({
     name:req.body.name,
     gmail: username,
     password: hashedPassword,
   
      profile_pic: req.file ? req.file.filename : null,
       age:req.body.age
   });
   
   res.json({navigate:'/login'})
 
 }
 
 })





passport.serializeUser(function(user,cb){
    console.log("the value within serialize user  ",user)
     cb(null,user)
   
   })
   
   
 passport.deserializeUser(function(user,cb){
    cb(null,user)
    
  
  })



  module.exports= router;
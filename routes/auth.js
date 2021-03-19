const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {registerValidation, loginValidation} = require('../validation');

//validation
const Joi = require('@hapi/joi');
const { required } = require('@hapi/joi');

/////////////////REGISTER ROUTE///////////////////////
router.post('/register', async (req, res) => {
  //validate data with joi thingy
const {error} = registerValidation(req.body)
 if (error) return res.send(error.details[0].message);
 
 //check if email is in db already
 const emailExists = await User.findOne({email: req.body.email});
 if(emailExists) return res.status(400).send('email already exists!');//if this is true the rest doesnt run anymore

 //hash passwords
 const salt = await bcrypt.genSalt(10);
 const hashedPassword = await bcrypt.hash(req.body.password, salt);

 //new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send(`user ${savedUser._id} sussesfully saved!`);
  } catch (err) {
    res.send(400).send(err);
  }
});

//////////////////LOGIN ROUTE///////////////////////

router.post('/login', async (req,res)=>{
      //validate data with joi thingy
    const {error} = loginValidation(req.body)
    if (error) return res.send(error.details[0].message);

     //check if email is in db already
    const userExists = await User.findOne({email: req.body.email});
    if(!userExists) return res.status(400).send('email or password are not correct!');//if this is true the rest doesnt run anymore
    //check if password is correct
    const validPass = await bcrypt.compare(req.body.password, userExists.password)
    if(!validPass) return res.status(400).send('Invaid password')
    
    //create and assign token
    const token = jwt.sign({_id: userExists._id}, process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);

    res.send('Logged in')
})


module.exports = router;

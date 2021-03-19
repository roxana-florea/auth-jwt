const router = require('express').Router();
const User = require('../models/User');
const verify = require('./verifyToken');

router.get('/',verify, (req,res)=>{
    res.json(req.user);
});





module.exports = router;
const express = require("express");
const router = express.Router();
const mongoose  = require ("mongoose");
const bcrypt = require("bcrypt");
//import user model 
const User = require ("../models/user");
 
const jwt = require('jsonwebtoken');

router.post('/signup' ,(req,res,next) => 
{   User.find({email :req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message:'mail exists'
                });
            }
            else{
                //add salt 10 considered safe 10 rounds 
                bcrypt.hash( req.body.password, 10 ,(err,hash) => {
                    if (err) {
                        return res.status(500).json({
                            error : err
                        });
                    }
                    else {
                        const user = new User({
                            email :req.body.email,
                            password:hash
                        });
                        user
                        .save()
                        .then( result => {
                            res.status(201).json({
                                message:'User created '
                            });
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error:err
                            });
                        });
                    }
                });
                   
            }
        });
    
 
});

/*router.post('/login',(req,res,next) => {
    User.findOne({email:req.body.email})
    .exec()
    .then(user =>{
        if(user.lenght <1) //we got no user
        {
            return res.status(401).json({ //401 unauthorized
            message:"Auth failed"
            });
        }
            /**
             * !attacker could just try out 
             * ! different emails and 
             * !figure out wich one is valid
             * */
        //check if valid password 
       /* bcrypt.compare(req.body.password,user[0].password,(err,result) =>{
            if (err) {
                 return res.status(401).json({
                    message:"auth failed"
                 });
            }
            if (result)
            {   
                const token = jwt.sign({
                    email:user[0].email,
                    userId:user[0]._id
                },process.env.JWT_KEY,
                {   // * options of signing process
                    expiresIn:"1h"
                }
                )
                //*callback get token 
                return res.status(200).json({
                    message: 'auth successful',
                    token:token
                });
            }
            res.status(401).json({
                message:"auth failed"
             });

        });
    })
    .catch(
        err =>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});
*/
/**
 * *I converted code using async/await and handled all the possibilities, 
 * * even the problem still exists it will give you all the information what is wrong.
 * * note that after finding the user, password can be retrieved from user.get("password") like this:
 */

router.post("/login", async (req, res, next) => {

    try {
      if (!req.body.email || !req.body.password) {
        return res.status(400).send("Email and password is required");
      }
  
      const { email, password } = req.body;
  
      let user = await User.findOne({ where: { email } });
  
      if (!user) {
        console.log("user not found");
        return res.status(401).json({ message: "Authentication failed" });
      }
  
      const validPassword = await bcrypt.compare(password, user.get("password"));
  
      if (!validPassword) {
        console.log("Password is not valid");
        return res.status(401).json({ message: "Authentication failed" });
    }
    const token = jwt.sign({
        email:req.body.email,
        userId:req.body._id
    },process.env.JWT_KEY,
    {   // * options of signing process
        expiresIn:"1h"
    }
    )
     //*callback get token 
     return res.status(200).json({
        message: 'auth successful',
        token:token
    });
    //return res.status(200).json({ message: "Authorization granted!" });
  } catch (err) {
    console.log("Err: ", err);
    res.status(500).json({ error: err });
  }
});


/**
 * todo login not woking smth wrong with bcrypt can't read password from body 
 */
router.delete('/:userId',(req,res,next)  => {
   User.remove({_id:req.params.userId})
       .exec()
       .then(result=> {
           res.status(200).json({
            message:'User deleted'
           });
       })
       .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
       
});
module.exports =router;
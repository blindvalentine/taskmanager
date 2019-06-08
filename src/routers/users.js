const express = require('express');
const router = new express.Router();
const User = require('../models/User');
const multer = require('multer');
const sharp= require('sharp');
const {sendWelcomeEmail, sendCancellationEmail} = require('../emails/account');

const auth = require('../middleware/authentication');

const avatar = multer({
  //dest: 'avatars',       removing results in multer passing the validated data back to callback functions
  limits: {
    fileSize: 1000000
  },
  fileFilter(req,file,cb) {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){            //     \ to escape period   dollar sign to signify extensions come at the end
      return cb(new Error('Please upload a Image file!'))
    }
    cb(undefined,true);
    // cb(new Error(''));
    // cb(undefined, true);
    // cb(undefined, false);
  }
})

router.post('/users', async (req,res)=>{
  const user = new User(req.body);   //constructor function and passing in body property from request
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();  //methods defined in User model
    res.status(201).send({user, token});
  } catch(e){
    res.status(400).send(e);
  }
})

router.post('/users/login', async(req, res)=>{
  try{
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({user, token});
  }catch(e){
    res.status(400).send(e);
  }
})


router.post('/users/logout', auth, async(req, res)=>{
  try{
    req.user.tokens = req.user.tokens.filter((token)=>{
      return token.token !== req.token;
    })
    await req.user.save();
    res.send();
  } catch(e){
    res.status(500).send(e);
  }
})

router.post('/users/logoutAll', auth, async(req,res)=>{
  try{
    req.user.tokens = [];
    await req.user.save();
    res.send();
  }catch(e){
    res.status(500).send(e);
  }
})

router.get('/users/me', auth, async (req, res)=>{
  try{
    res.send(req.user);
  }catch(e){
    res.send(e);
  }
})

// router.get('/users/:id', async (req, res)=>{        //using route parameters
//   const _id = req.params.id;         //req.params to extract route parameter
//   try{
//     const user = await User.findById(_id);
//     res.send(user);
//   } catch(e){
//     res.status(500).send(e);
//   }
// })

router.patch('/users/me', auth, async (req,res)=>{
  const updates = Object.keys(req.body);  //returns an array of strings of keys
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isUpdateValid = updates.every((update)=>{   //every returns a boolean
    return allowedUpdates.includes(update);     //will only return true if all true.
  })

  if(!isUpdateValid){
    return res.status(400).send({send: 'invalid updates!'});
  }
  //console.log(req.user['name']);
  try {
        //const user = await User.findById(req.user._id)        ///extract out the User document and update fields individually
        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save();   //save method to commit the changes to the document. will also cause associated middleware to run
        res.send(req.user)

    //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
  } catch(e){
    res.send(400).send(e);
  }
})


router.delete('/users/me', auth, async (req,res)=>{
  try {
    //const user = await User.findByIdAndDelete(req.user._id);
    // if(!user){
    //   return res.status(404).send();
    // }
    await req.user.remove();
    sendCancellationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch(e){
    res.status(500).send(e);
  }
})

router.post('/users/me/avatar', auth, avatar.single('avatar') , async (req,res)=>{    //middleware runs in order, auth then avatar.single
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (err, req, res, next)=>{    //default express error handler. adds at the end of a middleware stack
  res.status(400).send({error: err.message});
})

router.delete('/users/me/avatar', auth, async (req,res)=>{
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send('deleted!');
  } catch(e){
    res.status(500).send();
  }
})

router.get('/users/:id/avatar', async (req,res)=>{
  try {
    const user = await User.findById(req.params.id);
    if(!user || !user.avatar){
      throw new Error();
    }
    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  }catch(e){
    res.status(404).send();
  }
})
module.exports = router;

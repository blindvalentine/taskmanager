const express = require('express');
require('./db/mongoose');    //don't assign it to a const. file will run and ensure mongoose connects to the DB
const User = require('./models/User');
const Task = require('./models/Task');   //import mongoose models
const userRouter  = require('./routers/users');
const taskRouter = require('./routers/tasks');

const app = express();
const port = process.env.PORT;



const multer = require('multer');
const upload = multer({
  dest: 'images'
})

app.post('/upload', upload.single('upload'), (req,res)=>{
  res.send();
})





app.use(express.json());  //automatically parse incoming json. used to be body-parser
app.use(userRouter);   //registering userRouter
app.use(taskRouter); //registering taskRouter

app.listen(port, ()=>{
  console.log('Server is running on port ' + port + '!');
})

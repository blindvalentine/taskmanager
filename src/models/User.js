const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Task = require('./Task');

const userSchema = mongoose.Schema({
  name: {
    type: String,        //fields in this 'User' model. consists of name and age that are objects
    required: true,
    trim: true
  },
  password:{
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value){
      if(value.toLowerCase().includes('password')){
        throw new Error('Password cannot include password!');
      }
    }
  },
  email:{
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("email is not valid!");
      }
    }
  },
  age: {
    type: Number,   //javascript data types
    default: 0,
    validate(value){
        if(value < 0){
          throw new Error('Age must be a positive number!');
        }
    }
 },
 avatar: {
   type: Buffer
 },
 tokens: [{     //array of objects, each with a token property
   token: {
     type: String,
     required: true
   }
 }]
}, {
  timestamps: true
})

userSchema.virtual('tasks', {        //virtual reference to 'tasks' collection. allows mongoose to relate both models
  ref: 'tasks', //ref to Task model
  localField: '_id',
  foreignField: 'owner',  //localfield and foreign field must match. basically a foreign key
})

userSchema.methods.toJSON = function(){        //toJSON is always executed before it is passed to JSON.stringify. it takes an object and returns an object
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
}

userSchema.methods.generateAuthToken = async function(){
  const user = this;
  const token = jwt.sign({_id: user._id.toString()}, 'thisisatoken');
  user.tokens = user.tokens.concat({token});   //concat a string to tokens array in user model
  await user.save();
  return token;
}

userSchema.statics.findByCredentials = async (email, password)=>{    //creates a public function that can accessed using this model
  const user = await User.findOne({email});
  if(!user){
    throw new Error('this user does not exist')
  }

  const isMatched = await bcrypt.compare(password, user.password);    //bcrypt.compare will pass in the same hash

  if(!isMatched){
    throw new Error('unable to login!');
  }
  return user;
}

//hash the password before saving
userSchema.pre('save', async function(next){ //need to use normal functions are we require this to be binded to this function. arrow functions do not bind this.  runs on 'save' method
  const user = this;          //this gives access to the document being saved
  if (user.isModified('password')) {  //runs when password is modified or created (on save method)
      user.password =  await bcrypt.hash(user.password, 8);
  }
  next();        //tells the applicaiton that this middleware has ended
})

//delete tasks when user is removed
userSchema.pre('remove', async function(next) {
  const user = this;
  await Task.deleteMany({owner: user._id})
  next();
})

const User = mongoose.model('users', userSchema) //(modelname, schema)

module.exports = User;

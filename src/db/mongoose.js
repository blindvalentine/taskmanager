const mongoose = require('mongoose');

const connectionURL = process.env.MONGODB_URL;    //database is specified together with connection url in mongoose
//const databaseName = 'taskmanager-api';

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useCreateIndex: true,      //ensures that indexes are created when mongoose works with mongodb
  useFindAndModify: false
})




//
//
//
//
//
//
// const me = new User({  //new instance of User model
//   name: '    Joong     ',
//   email: '          HELLOW@GMAIL.COM           ',
//   password: 'hellohello'
// })
//
// me.save().then(()=>{   //use methods on instances to perform crud ops. returns a promise
//   console.log(me);                //saving the instance
// }).catch((error)=>{
//   console.log(error);
// })

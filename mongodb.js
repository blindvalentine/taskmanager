const mongodb = require('mongodb');

// const MongoClient = mongodb.MongoClient;      //initialize an instance of mongodb client

// const ObjectID = mongodb.ObjectID;

const {MongoClient, ObjectID} = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'taskmanager';

//const id = new ObjectID();  //initialize new instance of ID

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error,client)=>{
  if(error){
    return console.log('unable to connect to database!');
  }

  const db = client.db(databaseName);   //initialize an instance of a connection to desired database;

  db.collection('tasks').deleteOne({
    description:'pay bills'
  }).then((result)=>{
    console.log(result);
  }).catch((error)=>{
    console.log(error);
  })

  // db.collection('tasks').updateMany({
  //   completed: false
  // },{
  //   $set:{
  //     completed: true
  //   }
  // }).then((result)=>{
  //   console.log(result.modifiedCount);
  // }).catch((error)=>{
  //   console.log(error);
  // })


// db.collection('users').updateOne({
//   _id: new ObjectID('5cea39d689d9301d108d01f6')
// }, {
//   $inc:{
//     age: 1
//   }
// }).then((result)=>{
//   console.log(result.modifiedCount);
// }).catch((error)=>{
//   console.log(error);
// })
//


  // db.collection('users').findOne({
  //   _id: new ObjectID('5cea3effc0e0424484291918')
  // }, (error, user)=>{
  //   if(error){
  //     console.log('unable to fetch user!');
  //   }
  //   console.log(user);
  // })


  // db.collection('users').find({
  //   name: "yongjoong"
  // }).toArray((error,users)=> {
  //   console.log(users);
  // })

  // db.collection('tasks').findOne({
  //   _id: new ObjectID('5cea4069bfe34742348de39f')
  // }, (error, task)=>{
  //   if(error){
  //     return console.log('could not find task!');
  //   }
  //   console.log(task);
  // })
  //
  // db.collection('tasks').find({
  //   completed: false
  // }).toArray((error, tasks)=>{
  //   if(error){
  //     return console.log('could not find tasks!');
  //   }
  //   console.log(tasks);
  // })

  // db.collection('users').insertOne({ //insert 1 object into collection(tables in SQL) labelled users
  //   _id: id,
  //   name: 'robert',
  //   age: 33
  // }, (error, result)=>{        //callback function after connecting
  //   if(error){
  //     return console.log('unable to insert');
  //   }
  //
  //   console.log(result.ops);
  // });

  // db.collection('users').insertMany(
  //   [
  //     {
  //       name: 'tom',
  //       age: 22
  //     },
  //     {
  //       name: 'kore',
  //       age: 25
  //     }
  //   ]
  // ,(error,result)=>{
  //   if(error){
  //     return console.log('unable to add users!');
  //   }
  //
  //   console.log(result.ops);
  // })

  // db.collection('tasks').insertMany([
  //   {
  //     description: 'pay bills',
  //     compeleted: false
  //   },
  //   {
  //     description: 'feed cat',
  //     completed: true
  //   },
  //   {
  //     description: 'make dinner',
  //     completed: false
  //   }
  // ], (error, result)=>{
  //   if(error){
  //     return console.log('unable to add tasks!');
  //   }
  //   console.log(result.ops)
  // })
})

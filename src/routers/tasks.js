const express = require('express');
const router = new express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/authentication');

router.post('/tasks', auth, async (req,res)=>{
  const task = new Task({...req.body, owner: req.user._id})   //pass in own object to include owner property obtained from authentication
  try {
    await task.save();
    res.send(task);
  }catch(e){
    res.status(400).send(e);
  }
})

router.get('/tasks', auth, async (req,res)=>{
  const match = {};
  const sort = {};

  if(req.query.sortBy){
      const parts = req.query.sortBy.split(':')   //assuming special character here is :      localhost:3000/tasks?createdAt:desc
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;  //if there is no static name to access an object, use brackets to provide the variable name.
  }

  if(req.query.completed){
    match.completed = req.query.completed === 'true';
  }
  try{
    await req.user.populate(
      {
        path:'tasks',    //from collection
        match,
        options: {
          limit: parseInt(req.query.limit),     //limit to limit number of results returned each time
          skip: parseInt(req.query.skip),        //skip to control number of results to skip. for pagination, skip  = limit
          sort                                   //ascending is 1, descending is -1 can also apply to other parameters
        }
      }).execPopulate();    //creates a new attribute req.user.tasks in req.user and populates it with tasks. this is defined from the virtual reference in the model via the local and foreign fields
    // const tasks = await Task.find({completed: false});
    // if(!tasks){
    //   res.status(404).send();
    // }
    res.send(req.user.tasks);
  } catch (e){
    log
    res.status(500).send();
  }
})

router.get('/tasks/:id', auth, async (req, res)=>{
  const _id = req.params.id;
  try {
    const task = await Task.findOne({_id, owner: req.user._id});   //owner is passed in the create task route
    if(!task){
      return res.status(404).send();
    }
    res.send(task);
  } catch(e){
    res.status(500).send(e);
  }
})

router.patch('/tasks/:id', auth, async (req, res)=>{
  const updates = Object.keys(req.body);
  const allowedUpdates = ['completed', 'description'];
  const isUpdateValid = updates.every((update) => allowedUpdates.includes(update));
  if(!isUpdateValid){
    return res.send(400).send({send:'update is not valid!'});
  }

  try {

    const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
    if(!task){
      return res.status(404).send();
    }
    updates.forEach((update)=>{
      task[update] = req.body[update];
    })
    //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    await task.save();
    res.send(task);
  } catch(e){
    res.status(400).send(e);
  }
})

router.delete('/tasks/:id', auth, async(req,res)=>{
  try {
    const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
    if(!task){
      return res.status(404).send();
    }
    res.send(task);
  } catch(e){
    res.status(500).send(e);
  }
})

module.exports = router;

const mongoose =  require('mongoose');

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'   //must match model name
  }
}, {
  timestamps: true
})

const Task = mongoose.model('tasks', taskSchema);    //(model name, schema)
module.exports = Task;  //needs to match model name above

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  deadline: {
    type: String,
    required: true
  },
});

const Task = mongoose.model("tasks", taskSchema);

module.exports = Task;
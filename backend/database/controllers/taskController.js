const Task = require('../models/Task');

// 全タスク取得
const getAllTasks = async () => {
  try {
    const tasks = await Task.find();
    return tasks;
  } catch (error) {
    throw new Error(`タスク取得エラー: ${error.message}`);
  }
};

// タスク作成
const createTask = async (taskData) => {
  try {
    const { title, deadline } = taskData;
    const task = new Task({ title, deadline });
    await task.save();
    return task;
  } catch (error) {
    throw new Error(`タスク作成エラー: ${error.message}`);
  }
};

// タスク削除
const deleteTask = async (taskId) => {
  try {
    const result = await Task.findByIdAndDelete(taskId);
    return result;
  } catch (error) {
    throw new Error(`タスク削除エラー: ${error.message}`);
  }
};

module.exports = {
  getAllTasks,
  createTask,
  deleteTask
};
const express = require('express');
const connectDB = require('./database/connection');
const { getAllTasks, createTask, deleteTask } = require('./database/controllers/taskController');

const app = express();

// JSONパーサー設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === API Routes ===

// タスク全部取得
app.get('/tasks/', async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: error.message });
  }
});

// タスク作成
app.post('/tasks/', async (req, res) => {
  try {
    const task = await createTask(req.body);
    res.status(201).json({ 
      message: 'タスクが作成されました',
      id: task._id 
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: error.message });
  }
});

// タスク削除
app.delete('/tasks/:id', async (req, res) => {
  try {
    await deleteTask(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: error.message });
  }
});

// === Server Setup ===
const EXPRESS_PORT = 3000;

(async function main() {
  // MongoDB接続
  await connectDB();
  
  // サーバー起動
  app.listen(EXPRESS_PORT, () => {
    console.log("server is running");
  });
})();

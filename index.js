const express = require('express');
const app = express();
const port = 3000;

// POSTリクエストのbody(JSON形式)を解析するための設定
app.use(express.json());

// ダミーのタスクデータ（サーバーを止めると消える）
let tasks = [
  { id: 1, title: '牛乳を買う', done: false },
  { id: 2, title: 'Node.jsの勉強をする', done: true },
  { id: 3, title: '英語の勉強をする', done: true },
  { id: 4, title: '数学の勉強をする', done: true },
];

// GET /tasks : 全てのタスクを一覧で取得する
app.get('/tasks', (req, res) => {
  res.json(tasks); // JSON形式でタスク一覧を返す
});

// POST /tasks : 新しいタスクを追加する
app.post('/tasks', (req, res) => {
  // リクエストのbodyから新しいタスクの内容を取得
  const newTask = req.body;

  // 新しいタスクにIDを付与（簡易的な方法）
  newTask.id = tasks.length + 1;

  // タスク一覧に追加
  tasks.push(newTask);

  // 201 Createdステータスと共に、追加したタスクを返す
  res.status(201).json(newTask);
});


app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました`);
});
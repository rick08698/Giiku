const express = require('express');
const setupDatabase = require('./db.js'); // db.jsをインポート

const app = express();
const port = 3000;
app.use(express.json());

// グローバルなdb変数を準備
let db;

// サーバー起動前にデータベースのセットアップを行う
setupDatabase().then(databaseInstance => {
  db = databaseInstance; // データベースインスタンスをグローバル変数に格納
  app.listen(port, () => {
    console.log(`サーバーが http://localhost:${port} で起動しました`);
  });
}).catch(err => {
  console.error('データベースの起動に失敗しました:', err);
});


// GET /tasks : 全てのタスクを一覧で取得する
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await db.all("SELECT * FROM tasks");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks : 新しいタスクを追加する
app.post('/tasks', async (req, res) => {
  try {
    const { title, done } = req.body;
    // バリデーション
    if (typeof title === 'undefined' || typeof done === 'undefined') {
      return res.status(400).json({ error: 'titleとdoneは必須です' });
    }

    // SQLインジェクション対策のため、プレースホルダ(?)を使う
    const result = await db.run(
      "INSERT INTO tasks (title, done) VALUES (?, ?)",
      [title, done]
    );

    // 追加したタスクをID付きで取得して返す
    const newTask = await db.get("SELECT * FROM tasks WHERE id = ?", result.lastID);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
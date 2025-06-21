// index.js
require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // ObjectIdをインポート
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3001;
app.use(express.json());

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URIが.envファイルに設定されていません。');
}
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("MongoDBに正常に接続しました。");
    const database = client.db("todoAppDB");
    const tasksCollection = database.collection("tasks");

    // GET /tasks : 全てのタスクを一覧で取得する
    app.get('/tasks', async (req, res) => {
      try {
        const tasks = await tasksCollection.find({}).toArray();
        res.json(tasks);
      } catch (err) {
        res.status(500).json({ error: 'データベースからの取得に失敗しました。' });
      }
    });

    // POST /tasks : 新しいタスクを追加する
    app.post('/tasks', async (req, res) => {
      try {
        // ★ 変更点: done を受け取らないようにする
        const { title, deadline } = req.body;
        
        // ★ 変更点: titleのみを必須とするバリデーション
        if (!title) {
          return res.status(400).json({ error: 'titleは必須です。' });
        }
        
        // ★ 変更点: doneを含まない新しいタスクオブジェクト
        const newTask = { title, deadline: deadline || null };
        
        const result = await tasksCollection.insertOne(newTask);
        const insertedTask = { _id: result.insertedId, ...newTask };
        res.status(201).json(insertedTask);

      } catch (err) {
        res.status(500).json({ error: 'データベースへの保存に失敗しました。' });
      }
    });

    // ★ 追加: DELETE /tasks/:id : 指定されたIDのタスクを削除する
    app.delete('/tasks/:id', async (req, res) => {
      try {
        const { id } = req.params; // URLからIDを取得
        
        // IDが不正な形式の場合のエラーハンドリング
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: '無効なID形式です。'});
        }

        // データベースから該当IDのドキュメントを削除
        const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
          // 削除対象が見つからなかった場合
          return res.status(404).json({ error: '該当のタスクが見つかりません。'});
        }

        // 成功した場合、ステータス204 No Contentを返す
        res.status(204).send();

      } catch (err) {
        res.status(500).json({ error: 'データベースからの削除に失敗しました。'});
      }
    });


    app.listen(port, () => {
      console.log(`サーバーが http://localhost:${port} で起動しました`);
    });

  } catch (err) {
    console.error("アプリケーションの起動に失敗しました:", err);
    await client.close();
  }
}

run();

process.on('SIGINT', async () => {
  console.log("サーバーをシャットダウンします。");
  await client.close();
  process.exit();
});
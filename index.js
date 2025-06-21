// 1. 必要なモジュールの読み込み
require('dotenv').config(); // .envファイルから環境変数を読み込む
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // ObjectIdを追加

const app = express();
const port = 3001;

// 2. 環境変数から接続文字列を取得
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URIが.envファイルに設定されていません。');
}

// 3. MongoClientのインスタンスを作成
const client = new MongoClient(uri);

// 4. メインの非同期関数を定義
async function run() {
  try {
    // データベースに接続
    await client.connect();
    console.log("MongoDBに正常に接続しました。");

    // 使用するデータベースとコレクションを取得
    const database = client.db("todoAppDB"); // .envで指定したDB名
    const tasksCollection = database.collection("tasks");

    // Expressの設定
    app.use(express.json());

    // --- APIエンドポイントの定義 ---

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
        const newTask = req.body;
        
        // バリデーション（titleとdoneは必須）
        if (typeof newTask.title === 'undefined' || typeof newTask.done === 'undefined') {
          return res.status(400).json({ error: 'titleとdoneは必須です。' });
        }
        
        // データベースにタスクを挿入
        const result = await tasksCollection.insertOne(newTask);

        // 挿入されたドキュメントを返す（_idを含む）
        const insertedTask = { _id: result.insertedId, ...newTask };
        res.status(201).json(insertedTask);

      } catch (err) {
        res.status(500).json({ error: 'データベースへの保存に失敗しました。' });
      }
    });

    // Expressサーバーを起動
    app.listen(port, () => {
      console.log(`サーバーが http://localhost:${port} で起動しました`);
    });

  } catch (err) {
    console.error("アプリケーションの起動に失敗しました:", err);
    // エラーが発生したら接続を閉じる
    await client.close();
  }
}

// 5. メイン関数の実行
run();

// アプリケーション終了シグナルを補足してDB接続を閉じる
process.on('SIGINT', async () => {
  console.log("サーバーをシャットダウンします。");
  await client.close();
  process.exit();
});
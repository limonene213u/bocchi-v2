# 🎸 Bocchi VRM - Three.jsでぼっちちゃんを召喚！

![Bocchi VRM](https://your-demo-image-url.com/bocchi-preview.gif)

## 🚀 プロジェクト概要
Three.js + VRM を使って、ぼっちちゃんを3D空間で動かせるWebアプリ！
VRMモデルのアニメーション、ダイナミックなカメラワーク、BGM連動のリップシンクなどを実装！

🔗 **デモURL:** [Vercelで実行！](https://your-vercel-url.vercel.app)

---

## ✨ 特徴
- 🎮 **Three.js + VRM.js** を活用したリアルタイム3Dアニメーション
- 💃 **ダンスアニメーション** & **ギター演奏モーション** をランダム再生
- 🎥 **動的なカメラワーク** (オートローテート / ドリーズーム / フォーカスシフト)
- 🎵 **BGMとリップシンク連携** (口パク)
- 🔊 **ボリュームコントロール & UIエフェクト**

---

## 📸 スクリーンショット
![Bocchi VRM Demo](https://your-demo-image-url.com/screenshot.png)

---

## 🔧 インストール & セットアップ
### **1️⃣ クローン & インストール**
```sh
# リポジトリをクローン
git clone [https://github.com/yourname/bocchi-v2.git
cd bocchi-vrm

# 必要なパッケージをインストール
npm install
```

### **2️⃣ ローカルで実行**
```sh
npm run dev
```
ブラウザで `http://localhost:5173` を開く！

### **3️⃣ Vercelデプロイ (オプション)**
```sh
vercel deploy --prod
```

---

## 📂 ディレクトリ構成
```
📂 bocchi-v2/
├── 📂 public/            # VRMモデル, 音楽ファイルなど
│   └── 📂 vrma     # モーションファイル
├── 📂 src/               # ソースコード
│   ├── 📜 bocchi_v2.js     # メインスクリプト
│   ├── 📜 cameraControls.js # カメラワーク処理
│   ├── 📜 bgm.js        # BGM & リップシンク処理
│   ├── 📜 particles.js  # パーティクルエフェクト
│   ├── 📜 comments.js   # 流れるコメント機能
│   └── 📜 style.css     # スタイルシート
├── 📜 index.html        # メインHTML
├── 📜 vite.config.js    # Vite設定
└── 📜 README.md         # このファイル！
```

---

## ⚖ ライセンス
このプロジェクトは **MITライセンス** のもとで公開されています。

© 2025 りもこ

---

## ⭐ 貢献・フィードバック歓迎！
興味があれば **スター⭐ & フォーク** よろしくにゃん！
IssueやPRも大歓迎！🐾

```sh
# GitHubでスターをつけよう！
https://github.com/yourname/bocchi-vrm
```

🐾 **ぼっちちゃんを3D空間で動かそう！** 🎸🔥


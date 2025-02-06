const commentsContainer = document.getElementById("commentsContainer");

// **コメントリスト (JSON風に格納)**
const comments = [
    "ぼっちちゃん召喚！", "後藤じゃん", "すごい動いてる！", 
    "かわいい！", "これは神作！", "88888888", "すげえええええええええ",
    "wwwwwwwwwwwwwwww", "動きがこしたん", "どう見てもぼっち",
    "もっと動かして！", "尊い…", "演奏しようぜ！", "最高！", 
    "よきよき！", "カワイイ", "てぇてぇ...", "これVRM？", 
    "ぼざろ最高！", "アニメみたい！", "なんだこれ？", 
    "りもこ変態すぎ", "これはやばい", "未来きたな！", "エモすぎる！",
    "草生える", "神回！", "マジ卍", "ワロタwww", "超絶やばくね？",
    "これは芸術！", "マジやばい", "神すぎる", "えぐいwww", 
    "ガチで最高", "おいしい！", "これは凄い", "マジ天才", 
    "うおおおお！", "やばたん", "神レベル", "えぐすぎwww",
    "@ピザ", "@ピザ食べたい", "草不可避", "ここすき", "草ァ！",
    "レスポール持ってないやん", "神ってる", "ファッ!?", "は？かわいい", "これマ？",
    "草枯れた", "ここで草", "エモい", "うぽつ", "888888888",
    "ナイス！", "やべぇ...", "ぐうかわ", "最高かよ", "草不可避www",
    "ここすこ", "草ァ！", "やりますねぇ", "すごすぎかよ", "天才か？",
    "草ァ！", "ここすき", "エモすぎる", "やばたにえん", "後藤やん",
    "ここで草生える", "まじ神", "ファーwww", "ぴえん超えてぱおん",
    "草刈り機", "草原", "草むしり", "草を刈る", "@ピザ", "ギターヒーロ降臨と聞いて"
]


// **ランダムにコメントを流す**
function createComment() {
    const commentText = comments[Math.floor(Math.random() * comments.length)];
    
    const comment = document.createElement("div");
    comment.className = "comment";
    comment.innerText = commentText;
    
    // **ランダムな位置・色・サイズを設定**
    comment.style.top = `${Math.random() * 90}%`;  // 画面内のランダムな高さ
    comment.style.fontSize = `${Math.random() * 1.5 + 3}rem`; // 1rem〜2.5rem
    comment.style.color = `hsl(${Math.random() * 360}, 100%, 80%)`; // ランダムな色

    commentsContainer.appendChild(comment);

    // **10秒後に削除**
    setTimeout(() => comment.remove(), 10000);
}

// **定期的にコメントを流す**
setInterval(createComment, 1000);

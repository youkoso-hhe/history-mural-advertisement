import { pagesData } from './data.js';
import { translations } from './translations.js';

const artboard = document.getElementById('artboard');
const nextPageBtn = document.getElementById('next-page-btn');
const finalMessage = document.getElementById('final-message');
const clickSound = new Audio('./audio/click.mp3');

let currentPageIndex = 0;
let currentPieceIndex = 0;
let pieceTimer;
let isFirstClick = true; // 最初のクリックかを判定するフラグ

function translateUI() {
  // ブラウザの言語設定を取得 (例: "ja", "en-US" -> "en")
  const lang = navigator.language.split('-')[0];

  // 対応する翻訳テキストを取得（なければ英語をデフォルトにする）
  const t = translations[lang] || translations.en;

  // 各要素のテキストを書き換える
  nextPageBtn.textContent = t.nextButton;
  finalMessage.textContent = t.finalMessage;
}

// アートボードのサイズを画面に合わせて調整する関数
function resizeArtboard() {
  const baseWidth = 1920;  // Figmaのデザイン幅
  const baseHeight = 1080; // Figmaのデザイン高さ
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const scale = Math.min(windowWidth / baseWidth, windowHeight / baseHeight);

  // 水平方向の中央揃えに必要な移動量を計算
  const offsetX = (windowWidth - baseWidth * scale) / 2;
  
  // 垂直方向の位置調整に必要な移動量を計算 (少し上に表示)
  const offsetY = (windowHeight - baseHeight * scale) / 3; // ← / 3 や / 8 などお好みで調整

  // 「移動(translate)」と「拡大・縮小(scale)」をtransformプロパティで一度に指定
  artboard.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  
  //artboard.style.transform = `scale(${scale})`;
  // 中央揃えのための位置調整（必要に応じて）
  //artboard.style.left = `${(windowWidth - baseWidth * scale) / 2}px`;
  //artboard.style.top = `${(windowHeight - baseHeight * scale) / 2}px`;
}

// ページを読み込む関数
function loadPage(pageIndex) {
  artboard.innerHTML = ''; // アートボードの中身をクリア
  nextPageBtn.classList.add('hidden');
  finalMessage.classList.add('hidden');
  currentPieceIndex = 0;
  showNextPiece();
}

// 次のピースを表示する関数
function showNextPiece() {
  const currentPage = pagesData[currentPageIndex];
  if (!currentPage) return;
  const pieces = currentPage.pieces;

  if (currentPieceIndex >= pieces.length) {
    if (currentPageIndex >= pagesData.length - 1) {
      finalMessage.classList.remove('hidden');
    } else {
      nextPageBtn.classList.remove('hidden');
    }
    return;
  }

  const pieceData = pieces[currentPieceIndex];
  const adElement = document.createElement('div');
  adElement.classList.add('ad-piece');
  
  adElement.style.top = pieceData.top;
  adElement.style.left = pieceData.left;
  adElement.style.width = pieceData.width;
  adElement.style.height = pieceData.height;
  adElement.style.clipPath = `url(#${pieceData.clipPathId})`;

  //const adClient = 'ca-pub-4222268682478872'; // ID
  //const adSlot = '7758218160'; // 自分のスロットID

  //adElement.innerHTML = `<ins class="adsbygoogle" style="display:block; width:100%; height:100%;" data-ad-client="${adClient}" data-ad-slot="${adSlot}"></ins>`;
  adElement.innerHTML = `<script src="https://adm.shinobi.jp/s/1447b7928ae9bb4ca1f5940aec4a4516"></script>`;
  artboard.appendChild(adElement);

  try {
    (adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
    console.error("AdSense push error: ", e);
  }

  currentPieceIndex++;
  pieceTimer = setTimeout(showNextPiece, 3000);
}

// --- イベントリスナー ---
window.addEventListener('resize', resizeArtboard);

document.addEventListener('click', () => {
  clickSound.currentTime = 0; // 連打しても音が最初から鳴るようにする
  clickSound.play();
  if (isFirstClick) {
    const bgm = document.getElementById('bgm');
    bgm.play();
    bgm.muted = false; // ミュートを解除
    isFirstClick = false; // フラグを倒す
  }
  const currentPage = pagesData[currentPageIndex];
  if (currentPage && currentPieceIndex < currentPage.pieces.length) {
    clearTimeout(pieceTimer);
    showNextPiece();
  }
});

nextPageBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  currentPageIndex++;
  if (currentPageIndex < pagesData.length) {
    loadPage(currentPageIndex);
  }
});

// --- アプリケーション開始 ---
// ページと全てのコンテンツ（CSS,画像など）の読み込みが完了してから初期化処理を実行
window.addEventListener('load', () => {
  resizeArtboard();
  loadPage(currentPageIndex);
  translateUI();
});








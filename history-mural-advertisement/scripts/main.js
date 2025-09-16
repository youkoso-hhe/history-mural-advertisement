import { pagesData } from './data.js';
import { translations } from './translations.js';

const artboard = document.getElementById('artboard');
const nextPageBtn = document.getElementById('next-page-btn');
const finalMessage = document.getElementById('final-message');
const clickSound = new Audio('./audio/click.mp3');
let isFirstClick = true;
let currentPageIndex = 0;
let currentPieceIndex = 0;
let pieceTimer;

// アートボードのサイズと位置を画面に合わせて調整する関数
function resizeArtboard() {
  const baseWidth = 1758;
  const baseHeight = 1080;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const scale = Math.min(windowWidth / baseWidth, windowHeight / baseHeight);
  const offsetX = (windowWidth - baseWidth * scale) / 2;
  const offsetY = (windowHeight - baseHeight * scale) / 3;
  artboard.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

// ページを読み込む関数
function loadPage(pageIndex) {
  artboard.innerHTML = '';
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


  // ▼▼▼ ここから下の広告表示コードを、新しいものに置き換えます ▼▼▼

  // 一時的に非表示のiframeを作成して、その中でdocument.writeを実行させる
  const adTag = '<script src="https://adm.shinobi.jp/s/1447b7928ae9bb4ca1f5940aec4a4516"><\/script>';
  
  const tempIframe = document.createElement('iframe');
  tempIframe.style.display = 'none'; // 画面には表示しない
  document.body.appendChild(tempIframe); // 一時的にページに追加

  const iframeDoc = tempIframe.contentWindow.document;
  iframeDoc.open();
  // document.writeで生成されたHTMLを取得
  iframeDoc.write(adTag);
  iframeDoc.close();
  
  // document.writeによってiframe内に生成された広告要素を、
  // 本来の広告枠(adElement)に移動させる
  const adContent = iframeDoc.body.firstChild;
  if (adContent) {
    adElement.appendChild(adContent);
  }
  
  // 一時的に使ったiframeはページから削除
  document.body.removeChild(tempIframe);

  // ▲▲▲ 置き換えはここまで ▲▲▲


  artboard.appendChild(adElement);

  // AdSense用のtry-catchブロックは不要なので削除します

  currentPieceIndex++;
  pieceTimer = setTimeout(showNextPiece, 3000);
}

// UIのテキストを翻訳する関数
function translateUI() {
  const lang = navigator.language.split('-')[0];
  const t = translations[lang] || translations.en;
  nextPageBtn.textContent = t.nextButton;
  finalMessage.textContent = t.finalMessage;
}

// --- イベントリスナー ---
window.addEventListener('resize', resizeArtboard);

document.addEventListener('click', () => {
  clickSound.currentTime = 0;
  clickSound.play();
  if (isFirstClick) {
    const bgm = document.getElementById('bgm');
    if (bgm) {
        bgm.play().catch(e => console.error("BGM play failed:", e));
        bgm.muted = false;
    }
    isFirstClick = false;
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
window.addEventListener('load', () => {
  resizeArtboard();
  loadPage(currentPageIndex);
  translateUI();
});


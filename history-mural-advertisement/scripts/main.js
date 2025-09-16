import { pagesData } from './data.js';
import { translations } from './translations.js';

const artboard = document.getElementById('artboard');
const nextPageBtn = document.getElementById('next-page-btn');
const finalMessage = document.getElementById('final-message');
const clickSound = new Audio('./audio/click.mp3');
let isFirstClick = true;
let currentPageIndex = 0;

// UIのテキストを翻訳する関数
function translateUI() {
  const lang = navigator.language.split('-')[0];
  const t = translations[lang] || translations.en;
  nextPageBtn.textContent = t.nextButton;
  finalMessage.textContent = t.finalMessage;
}

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

// ページを読み込む関数（広告プリロード方式）
function loadPage(pageIndex) {
  artboard.innerHTML = '';
  nextPageBtn.classList.add('hidden');
  finalMessage.classList.add('hidden');
  
  const currentPage = pagesData[pageIndex];
  if (!currentPage) return;

  // ページに必要な全ての広告枠を、最初に一度だけすべて生成する
  currentPage.pieces.forEach(pieceData => {
    const adElement = document.createElement('div');
    adElement.classList.add('ad-piece', 'hidden-ad'); // 最初は非表示
    
    adElement.style.top = pieceData.top;
    adElement.style.left = pieceData.left;
    adElement.style.width = pieceData.width;
    adElement.style.height = pieceData.height;
    adElement.style.clipPath = `url(#${pieceData.clipPathId})`;

    // 広告用のiframeを作成して広告を読み込ませる
    const adTagHTML = '<html><head></head><body style="margin:0;"><script src="https://adm.shinobi.jp/s/1447b7928ae9bb4ca1f5940aec4a4516"><\/script></body></html>';
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    iframe.setAttribute('scrolling', 'no');
    iframe.srcdoc = adTagHTML;
    adElement.appendChild(iframe);

    artboard.appendChild(adElement);
  });
}

// 次のピースを表示する関数（プリロード方式）
function showNextPiece() {
  const hiddenPieces = artboard.querySelectorAll('.ad-piece.hidden-ad');

  if (hiddenPieces.length > 0) {
    hiddenPieces[0].classList.remove('hidden-ad');
  }

  // もし非表示のピースが残り1つになったら（＝最後のピースが表示されたら）
  if (hiddenPieces.length <= 1) {
    if (currentPageIndex >= pagesData.length - 1) {
      finalMessage.classList.remove('hidden');
    } else {
      nextPageBtn.classList.remove('hidden');
    }
  }
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
  
  showNextPiece();
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

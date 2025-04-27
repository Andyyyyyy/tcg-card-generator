const imageUpload = document.getElementById('imageUpload');
const artworkButton = document.getElementById('card-artwork');

const cardBorder = document.getElementById('card');
const cardBorderInput = document.getElementById('border');

const cardInner = document.querySelector('.card-inner');
const cardBgInput = document.getElementById('cardBg');

const textColor = '#000000';
const textcolorInput = document.getElementById('textColor');

const gradientInput = document.getElementById('gradient');
const borderGradientInput = document.getElementById('borderGradient');

let hasArtwork = false;
let isDragging = false;

let prevMouseY = 0;
let backgroundPositionY = 0;
let dragStartPos = 0;

function randomHexColor() {
  const randomChannel = () => Math.floor(128 + Math.random() * 128);
  const toHex = (c) => c.toString(16).padStart(2, '0');

  const r = randomChannel();
  const g = randomChannel();
  const b = randomChannel();

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function setCardBackground(value) {
  if (gradientInput.checked) {
    value = generateGradient(value);
  }
  cardInner.style.background = value;
}

function setCardBorder(value) {
  if (borderGradientInput.checked) {
    value = generateGradient(value, -15);
  }
  card.style.background = value;
}

const initalCardBg = randomHexColor();
cardBgInput.value = initalCardBg;
setCardBackground(initalCardBg);

document.querySelectorAll('[contenteditable]').forEach(el => {
  el.addEventListener('focus', function(e) {
    const range = document.createRange();
    range.selectNodeContents(e.target);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  });
});


artworkButton.addEventListener('click', () => {
  if (hasArtwork) return;
  imageUpload.click();
});

imageUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    artworkButton.style.backgroundImage = `url('${e.target.result}')`;
    imageUpload.setAttribute('disabled', true);
    artworkButton.style.cursor = 'grab';
    hasArtwork = true;
  };
  reader.readAsDataURL(file);
});

document.getElementById('downloadBtn').addEventListener('click', function () {
  const card = document.getElementById('card');

  htmlToImage
    .toPng(card)
    .then(function (dataUrl) {
      const link = document.createElement('a');
      link.download = 'card.png';
      link.href = dataUrl;
      link.click();
    })
    .catch(function (error) {
      console.error('oops, something went wrong!', error);
    });
});

artworkButton.addEventListener('mousedown', (e) => {
  if (!hasArtwork) return;
  isDragging = true;
  artworkButton.style.cursor = 'grabbing';
  dragStartPos = e.clientY;
});

window.addEventListener('mouseup', () => {
  if (!hasArtwork) return;
  isDragging = false;
  artworkButton.style.cursor = 'grab';
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const delta = ((dragStartPos - e.clientY) / window.innerHeight) * 100;
  backgroundPositionY = backgroundPositionY - delta;
  dragStartPos = e.clientY;
  artworkButton.style.backgroundPositionY = `${backgroundPositionY}vh`;
});

cardBorderInput.addEventListener('input', (e) => {
  setCardBorder(e.target.value);
});

cardBgInput.addEventListener('change', (e) => {
  setCardBackground(e.target.value);
});

textcolorInput.addEventListener('input', (e) => {
  const value = e.target.value;
  cardInner.style.color = value;
});

function generateGradient(hexColor, deg = 15) {
  // Remove the "#" if it's there
  hexColor = hexColor.replace('#', '');

  // Parse R, G, B values
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  // Darken each color component (e.g., by 20%)
  const lighten = (value) => Math.min(255, Math.floor(value * 3));

  const r2 = lighten(r);
  const g2 = lighten(g);
  const b2 = lighten(b);

  return `linear-gradient(${deg}deg, rgb(${r}, ${g}, ${b}) 0%, rgb(${r2}, ${g2}, ${b2}) 50%, rgb(${r}, ${g}, ${b}) 100%)`;
}

gradientInput.addEventListener('change', (e) => {
  if (e.target.checked) {
    cardInner.style.background = generateGradient(cardBgInput.value);
  } else {
    cardInner.style.background = cardBgInput.value;
  }
});

borderGradientInput.addEventListener('change', (e) => {
  setCardBorder(cardBorderInput.value);
});

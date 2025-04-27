const root = document.documentElement;
const imageUpload = document.getElementById('imageUpload');
const artworkButton = document.getElementById('card-artwork');

const cardBorder = document.getElementById('card');
const cardBorderInput = document.getElementById('border');
const eyedropperBorder = document.getElementById('eyedropperBorder');

const cardInner = document.querySelector('.card-inner');
const cardBgInput = document.getElementById('cardBg');
const eyedropperCardBg = document.getElementById('eyedropperCardBg');

const gradientInput = document.getElementById('gradient');
const borderGradientInput = document.getElementById('borderGradient');

const artworkBorderInput = document.getElementById('artworkBorder');
const eyedropperArtworkBorder = document.getElementById(
  'eyedropperArtworkBorder'
);

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

function setArtworkBorder(value) {
  root.style.setProperty('--artwork-border-color', value);
}

const initialColor = randomHexColor();
cardBgInput.value = initialColor;
cardBorderInput.value = initialColor;
artworkBorderInput.value = initialColor;
setCardBackground(initialColor);
setCardBorder(initialColor);
setArtworkBorder(initialColor);

document.querySelectorAll('[contenteditable]').forEach((el) => {
  el.addEventListener('focus', function (e) {
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

cardBgInput.addEventListener('input', (e) => {
  setCardBackground(e.target.value);
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

artworkBorderInput.addEventListener('input', (e) => {
  setArtworkBorder(e.target.value);
});

eyedropperArtworkBorder.addEventListener('click', () => {
  const colorPicker = new EyeDropper();
  colorPicker
    .open()
    .then((result) => {
      artworkBorderInput.value = result.sRGBHex;
      setArtworkBorder(result.sRGBHex);
    })
    .catch((e) => console.log(e));
});

eyedropperBorder.addEventListener('click', () => {
  const colorPicker = new EyeDropper();
  colorPicker
    .open()
    .then((result) => {
      cardBorderInput.value = result.sRGBHex;
      setCardBorder(result.sRGBHex);
    })
    .catch((e) => console.log(e));
});
eyedropperCardBg.addEventListener('click', () => {
  const colorPicker = new EyeDropper();
  colorPicker
    .open()
    .then((result) => {
      cardBgInput.value = result.sRGBHex;
      setCardBackground(result.sRGBHex);
    })
    .catch((e) => console.log(e));
});

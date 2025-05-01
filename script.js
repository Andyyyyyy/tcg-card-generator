const root = document.documentElement;
const imageUpload = document.getElementById('imageUpload');
const artworkButton = document.getElementById('card-artwork');

const cardBorder = document.getElementById('card');
const cardBorderInput = document.getElementById('border');
const eyedropperBorder = document.getElementById('eyedropperBorder');

const cardInner = document.querySelector('.card-inner');
const cardBgInput = document.getElementById('cardBg');
const eyedropperCardBg = document.getElementById('eyedropperCardBg');

const artworkBorderInput = document.getElementById('artworkBorder');
const eyedropperArtworkBorder = document.getElementById(
  'eyedropperArtworkBorder'
);

let hasArtwork = false;
let isDragging = false;

let prevMouseY = 0;
let backgroundPositionY = 0;
let dragStartPos = 0;

let holo = false;
const holoInput = document.getElementById('holoBorder');
holoInput.addEventListener('change', (e) => {
  holo = e.target.checked;
  if (holo) {
    cardBorder.classList.add('holo-border');
  } else {
    cardBorder.classList.remove('holo-border');
    setCardBorder(cardBorderInput.value);
  }
});

function setCardBorder(value) {
  value = generateGradient(value);

  root.style.setProperty('--card-border', value);
}

function randomHexColor() {
  const randomChannel = () => Math.floor(128 + Math.random() * 128);
  const toHex = (c) => c.toString(16).padStart(2, '0');

  const r = randomChannel();
  const g = randomChannel();
  const b = randomChannel();

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function setCardBackground(value) {
  value = generateGradient(value);

  root.style.setProperty('--card-background', value);
}

function setArtworkBorder(value) {
  root.style.setProperty('--artwork-border-color', value);
}

function randomizeColors() {
  const initialColor = randomHexColor();
  cardBgInput.value = initialColor;
  cardBorderInput.value = initialColor;
  artworkBorderInput.value = initialColor;
  setCardBackground(initialColor);
  setCardBorder(initialColor);
  setArtworkBorder(initialColor);
}
randomizeColors();

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

  const blobUrl = URL.createObjectURL(file);

  root.style.setProperty('--artwork-url', `url('${blobUrl}')`);
  imageUpload.setAttribute('disabled', true);
  artworkButton.style.cursor = 'grab';
  hasArtwork = true;
});

const downloadButton = document.getElementById('downloadBtn');
downloadButton.addEventListener('click', function () {
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
  if (isDone) return;
  isDragging = true;
  artworkButton.style.cursor = 'grabbing';
  dragStartPos = e.clientY;
});

window.addEventListener('mouseup', () => {
  if (!hasArtwork) return;
  if (isDone) return;
  isDragging = false;
  artworkButton.style.cursor = 'grab';
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  if (isDone) return;

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

function generateGradient(hexColor) {
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

  return `linear-gradient(var(--border-shine-deg), rgb(${r}, ${g}, ${b}) 0%, rgb(${r2}, ${g2}, ${b2}) 50%, rgb(${r}, ${g}, ${b}) 100%)`;
}

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

const fullartInput = document.getElementById('fullart');
fullartInput.addEventListener('change', (e) => {
  if (!hasArtwork) {
    e.target.checked = false;
    return;
  }
  if (e.target.checked) {
    cardInner.classList.add('fullart');
  } else {
    cardInner.classList.remove('fullart');
  }
});

const randomizeButton = document.querySelector('.randomize');
randomizeButton.addEventListener('click', (e) => {
  e.preventDefault();
  randomizeColors();
});
let isDone = false;
const doneButton = document.getElementById('doneButton');
doneButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (!hasArtwork) return;
  artworkButton.style.cursor = null;

  document.querySelector('body').classList.add('done');

  for (const el of document.querySelectorAll('[contenteditable]')) {
    el.setAttribute('contenteditable', false);
  }

  isDone = true;
});

const container = document.querySelector('.container');
let isAnimating = false;

container.addEventListener('mousemove', (e) => {
  if (!isDone || isAnimating) return;
  isAnimating = true;

  requestAnimationFrame(() => {
    const containerSize = container.getBoundingClientRect();
    const leftPercent =
      ((e.clientX - containerSize.left) / containerSize.width) * 100;
    const topPercent =
      ((e.clientY - containerSize.top) / containerSize.height) * 100;

    // rotate between -45 and 45 degrees based on mouse position
    const rotationX = ((topPercent - 50) / 50) * 45;
    const rotationY = ((leftPercent - 50) / 50) * -45;

    root.style.setProperty('--rotation-y', `${rotationY}deg`);
    root.style.setProperty('--rotation-x', `${rotationX}deg`);

    const shineDeg = ((leftPercent + topPercent) / 2) * 3.6;
    root.style.setProperty('--border-shine-deg', `${shineDeg}deg`);

    isAnimating = false;
  });
});

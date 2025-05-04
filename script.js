const root = document.documentElement;
const imageUpload = document.getElementById('imageUpload');
const artworkButton = document.getElementById('card-artwork');

const card = document.getElementById('card');
const cardback = document.querySelector('card-back');
const cardBorderInput = document.getElementById('border');
const eyedropperBorder = document.getElementById('eyedropperBorder');

const cardInner = document.querySelector('.card-inner');
const cardBgInput = document.getElementById('cardBg');
const eyedropperCardBg = document.getElementById('eyedropperCardBg');

const artworkBorderInput = document.getElementById('artworkBorder');
const eyedropperArtworkBorder = document.getElementById(
  'eyedropperArtworkBorder'
);

const configpanel = document.querySelector('.configpanel');

let hasArtwork = false;
let isDragging = false;

let backgroundPositionY = 0;
let dragStartPos = 0;

let holo = false;
const holoInput = document.getElementById('holoBorder');
holoInput.addEventListener('change', (e) => {
  holo = e.target.checked;
  if (holo) {
    card.classList.add('holo-border');
  } else {
    card.classList.remove('holo-border');
    setCardBorder(cardBorderInput.value);
  }
});

function setCardBorder(value) {
  value = generateGradient(value);

  root.style.setProperty('--card-border', value);
}

function randomHexColor() {
  const randomChannel = () => Math.floor(90 + Math.random() * 255 - 90);
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
  artworkButton.classList.add('hasArtwork');
  hasArtwork = true;
  resetButton.removeAttribute('disabled');
});

const downloadButton = document.getElementById('downloadBtn');
downloadButton.addEventListener('click', function () {
  const card = document.getElementById('card');

  root.style.removeProperty('--shine-deg');
  root.style.setProperty('--rotation-x', '0deg');
  root.style.setProperty('--rotation-y', '0deg');

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

// Support touch and mouse input
artworkButton.addEventListener('mousedown', startDrag);
artworkButton.addEventListener('touchstart', startDrag, { passive: false });

window.addEventListener('mouseup', endDrag);
window.addEventListener('touchend', endDrag);

window.addEventListener('mousemove', onDrag);
window.addEventListener('touchmove', onDrag, { passive: false });

function getClientY(event) {
  return event.touches ? event.touches[0].clientY : event.clientY;
}

function startDrag(e) {
  if (!hasArtwork || isDone) return;

  isDragging = true;
  artworkButton.style.cursor = 'grabbing';
  dragStartPos = getClientY(e);

  // prevent scrolling on touch devices while dragging
  if (e.cancelable) e.preventDefault();
}

function endDrag() {
  if (!hasArtwork || isDone) return;

  isDragging = false;
  artworkButton.style.cursor = 'grab';
}

function onDrag(e) {
  if (!isDragging || isDone) return;

  const currentY = getClientY(e);
  const delta = ((dragStartPos - currentY) / window.innerHeight) * 100;

  backgroundPositionY -= delta;
  dragStartPos = currentY;

  artworkButton.style.backgroundPositionY = `${backgroundPositionY}vh`;

  if (e.cancelable) e.preventDefault(); // prevent accidental scroll
}

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

  return `linear-gradient(var(--shine-deg, 344deg), rgb(${r}, ${g}, ${b}) 0%, rgb(${r2}, ${g2}, ${b2}) 50%, rgb(${r}, ${g}, ${b}) 100%)`;
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

  resetButton.setAttribute('disabled', true);

  configpanel.inert = true;
  const rotateTransforms = [
    {
      transform: ' perspective(1000px) rotateY(360deg)',
    },
    {
      transform: ' perspective(1000px) rotateY(0deg)',
    },
  ];
  const cardAnim = container.animate(rotateTransforms, {
    easing: 'ease-in-out',
    duration: 1000,
  });
  cardAnim.onfinish = () => {
    isDone = true;
  };
});

const container = document.querySelector('.container');
let isAnimating = false;

const body = document.querySelector('body');

function getEventCoords(e) {
  return e.touches ? e.touches[0] : e;
}

function handleRotate(e) {
  if (!isDone || isAnimating) return;
  isAnimating = true;

  requestAnimationFrame(() => {
    const coords = getEventCoords(e);
    const containerSize = document.body.getBoundingClientRect();
    const leftPercent =
      ((coords.clientX - containerSize.left) / containerSize.width) * 100;
    const topPercent =
      ((coords.clientY - containerSize.top) / containerSize.height) * 100;

    const rawRotationX = Math.min(45, ((topPercent - 50) / 50) * 45);
    const rotationX = Math.max(-45, Math.min(45, rawRotationX));

    const rawRotationY = ((leftPercent - 50) / 50) * -45;
    const rotationY = Math.max(-45, Math.min(45, rawRotationY));

    root.style.setProperty('--rotation-y', `${rotationY}deg`);
    root.style.setProperty('--rotation-x', `${rotationX}deg`);

    const rawShineDeg = ((leftPercent + topPercent) / 2) * 3.6;
    const shineDeg = Math.max(0, Math.min(360, rawShineDeg));
    root.style.setProperty('--shine-deg', `${shineDeg}deg`);

    isAnimating = false;
  });

  // prevent scrolling while dragging on mobile
  if (e.cancelable) e.preventDefault();
}

// Add both event listeners
document.body.addEventListener('mousemove', handleRotate);
document.body.addEventListener('touchmove', handleRotate, { passive: false });

const foilInput = document.getElementById('foil');
foilInput.addEventListener('change', (e) => {
  if (e.target.checked) {
    card.classList.add('foil');
  } else {
    card.classList.remove('foil');
  }
});

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', (e) => {
  e.preventDefault();
  for (const el of document.querySelectorAll('[contenteditable]')) {
    el.setAttribute('contenteditable', true);
  }
  hasArtwork = false;
  artworkButton.classList.remove('hasArtwork');

  imageUpload.removeAttribute('disabled');
  root.style.removeProperty('--artwork-url');
  imageUpload.value = null;
  artworkButton.removeAttribute('style');
  cardInner.classList.remove('fullart');
  fullartInput.checked = false;
  backgroundPositionY = 0;
  dragStartPos = 0;

  resetButton.setAttribute('disabled', true);
});

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const height = entry.contentRect.height;
    const fontSize = height * 0.018;
    root.style.setProperty('--card-font-size', `${fontSize}px`);
  }
});

resizeObserver.observe(card);

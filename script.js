const imageUpload = document.getElementById('imageUpload');
const artworkButton = document.getElementById('card-artwork');
let hasArtwork = false;
let isDragging = false;

let prevMouseY = 0;
let backgroundPositionY = 0;
let dragStartPos = 0;

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

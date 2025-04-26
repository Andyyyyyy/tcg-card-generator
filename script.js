const imageUpload = document.getElementById('imageUpload');
const artworkButton = document.getElementById('card-artwork');

artworkButton.addEventListener('click', () => {
  imageUpload.click();
});

imageUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    artworkButton.style.backgroundImage = `url('${e.target.result}')`;
  };
  reader.readAsDataURL(file);
});

document.getElementById('downloadBtn').addEventListener('click', function () {
    const card = document.getElementById('card');
  
    htmlToImage.toPng(card)
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
  
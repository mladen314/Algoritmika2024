const openButton = document.querySelector('.open-button');
const infoBoxOverlay = document.getElementById('infoBoxOverlay');

openButton.addEventListener('click', () => {
    infoBoxOverlay.style.display = 'flex';
});

function closeInfoBox() {
    infoBoxOverlay.style.display = 'none';
}
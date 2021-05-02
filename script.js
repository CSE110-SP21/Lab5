// script.js
const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image'); // User image
var ctx = canvas.getContext('2d'); // Canvas to draw to
const sub = document.querySelector("[type='submit']"); // Submit button
const clr = document.querySelector("[type='reset']"); // Clear button
const read = document.querySelector("[type='button']"); // Read button
const getImageInput = document.getElementById('image-input'); // User image input
const vol = document.querySelector("[type='range']"); // Volume ranges
const form = document.getElementById("generate-meme"); // Generate button

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // Canvas dimensions
  var dim = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  // Clears previous
  ctx.clearRect(0,0,canvas.width, canvas.height);
  // Sets black background
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvas.width, canvas.height);
  // Draws Image
  ctx.drawImage(img, dim.startX, dim.startY, dim.width, dim.height);

  sub.disabled = false;
  clr.disabled = true;
  read.disabled = true;
});

// Fetch User Image and calls load
img.src = document.getElementById('image-input');
getImageInput.addEventListener('change', ()=> {
  console.log(getImageInput);
  console.log(getImageInput.value);
  console.log(getImageInput.files[0]);
  img.src = URL.createObjectURL(getImageInput.files[0]);
});

// Text fill/outline creation
function drawStroked(text, x, y) {
  ctx.textAlign = 'center';
  ctx.font = '30px Sans-serif';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = 'white';
  ctx.fillText(text, x, y);
}

// Generate button
form.addEventListener('submit', (event) => {
  // Prevents from submitting
  event.preventDefault();
  // Top and Bottom text
  let topText = document.getElementById("text-top").value;
  let bottomText = document.getElementById("text-bottom").value;

  drawStroked(topText, canvas.width/2 , 40);
  drawStroked(bottomText, canvas.width/2 , canvas.height - 20);

  sub.disabled = true;
  clr.disabled = false;
  read.disabled = false;
});

// Clear button
clr.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sub.disabled = false;
  clr.disabled = true;
  read.disabled = true;
});

// Populate Voice list  
var synth = window.speechSynthesis; 
window.addEventListener("load", (event) => {
  event.preventDefault();

  let voiceSelect = document.querySelector('select');
  voiceSelect.disabled = false;
  let voices = synth.getVoices();

  for(let i = 0; i < voices.length ; i++) {
    let option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }
    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
});

// Reading the text
read.addEventListener('click', (event) => {
  event.preventDefault();

  let voiceSelect = document.querySelector('select');
  voiceSelect.disabled = false;
  let voices = synth.getVoices();
  let topText = document.getElementById("text-top").value;
  let bottomText = document.getElementById("text-bottom").value;
  let utterThis = new SpeechSynthesisUtterance(topText+bottomText);
  let selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(let i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }
  utterThis.volume = vol.value/100;
  synth.speak(utterThis);
});

// Changes volume icon depending on vol level
vol.addEventListener('click', () => {
  const icon = document.getElementById("volume-group").getElementsByTagName("img")[0];

  if (vol.value == 0) {
    icon.src = "icons/volume-level-0.svg";
    icon.alt = "Volume Level 0";
  }
  else if (vol.value < 34) {
    icon.src = "icons/volume-level-1.svg";
    icon.alt = "Volume Level 2";
  }
  else if (vol.value < 67) {
    icon.src = "icons/volume-level-2.svg";
    icon.alt = "Volume Level 2";
  }
  else {
    icon.src = "icons/volume-level-3.svg";
    icon.alt = "Volume Level 3";
  }
});


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}

// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
var reset = document.querySelector('button[type=reset]');
var read = document.querySelector('button[type=button');
var canvas = document.getElementById('user-image');
var ctx = canvas.getContext('2d');
//ctx.fillRect(0,0,canvas.width, canvas.height);
ctx.font = '36px calibri';
ctx.textAlign = 'center';
var submit = document.querySelector('button[type=submit]');
var inp = document.getElementById('image-input');
var dim = getDimensions(canvas.width, canvas.height, img.width, img.height);
var inp = document.getElementById('image-input');
var syn = window.speechSynthesis;
var voice = document.getElementById('voice-selection');
var opt = document.querySelector('select');
//var voices = syn.getVoices();
//alert(voices.length);
var voices = [];
var topText;
var botText;
var volimg = document.querySelector('div img');
var vol = document.querySelector('[type=range]');
var talk;
var syn = window.speechSynthesis;
var talk = new SpeechSynthesisUtterance();

/*voice.addEventListener('load', function() {
  var syn = window.speechSynthesis;
  voices = syn.getVoices();
  for(let i = 0; i < voices.length; i++)
  {
    var op = document.createElement('option');
    op.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    op.setAttribute('data-lang', voices[i].lang);
    op.setAttribute('data-name', voices[i].name);
    opt.appendChild(op);
  }
});
*/


read.addEventListener('click', function() {
  //syn = window.speechSynthesis;
  talk.text = topText + botText;
  for(let i = 0; i < voices.length; i++)
  {
    if(opt.selectedOptions[0].getAttribute('data-name') === voice[i].getAttribute('data-name'))
    {
      talk.voice = voices[i];
      break;
    }
  }
  syn.speak(talk);
});

inp.addEventListener('input', function() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  //ctx.fillStyle = 'white';
  img.src = URL.createObjectURL(inp.files[0]);
});

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  ctx.fillStyle = 'black';
  var dim = getDimensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img,dim['startX'],dim['startY'],dim.width,dim.height);
  ctx.fillRect(0,0,canvas.width,canvas.height/10);
  ctx.fillRect(0,canvas.height*.9,canvas.width,canvas.height/10);
});

document.getElementById('generate-meme').addEventListener('submit', function(event) {
  //ctx.fillStyle = 'black';
  //ctx.fillRect(0,0,canvas.width,canvas.height);
  topText = document.getElementById('text-top').value;
  botText = document.getElementById('text-bottom').value;
  //ctx.fillRect(0,0,canvas.width,canvas.height/10);
  //ctx.fillRect(0,canvas.height*.9,canvas.width,canvas.height/10);
  ctx.fillStyle = 'white';
  ctx.fillText(topText, canvas.width/2, canvas.height/10);
  ctx.fillText(botText, canvas.width/2, canvas.height);

  //var syn = window.speechSynthesis;
  voices = syn.getVoices();
  opt.textContent = '';
  for(let i = 0; i < voices.length; i++)
  {
    var op = document.createElement('option');
    op.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    op.setAttribute('data-lang', voices[i].lang);
    op.setAttribute('data-name', voices[i].name);
    opt.appendChild(op);
  }
  event.preventDefault();
  submit.toggleAttribute('disabled');
  read.toggleAttribute('disabled');
  reset.toggleAttribute('disabled');
  voice.toggleAttribute('disabled');
});

reset.addEventListener('click', function() {
  submit.toggleAttribute('disabled');
  //ctx.fillStyle = 'black';
  //ctx.fillRect(0,0,canvas.width,canvas.height);
  //ctx.fillStyle = 'white';
  ctx.clearRect(0,0,canvas.width,canvas.height);
  read.toggleAttribute('disabled');
  voice.toggleAttribute('disabled');
  reset.toggleAttribute('disabled');
  document.getElementById('generate-meme').reset();
});

vol.addEventListener('change', () =>{
  //var volume = document.querySelector('[type=range]');
  //volume.setAttribute('value',vol.childNodes[3].value);
  talk.volume = vol.value/100;
  if(talk.volume >= 0.67)
  {
    volimg.setAttribute('src','icons/volume-level-3.svg');
  }
  else if(talk.volume >= 0.34 && talk.volume < 0.67)
  {
    volimg.setAttribute('src','icons/volume-level-2.svg');
  }
  else if(talk.volume > 0 && talk.volume < 0.34)
  {
    volimg.setAttribute('src','icons/volume-level-1.svg');
  }
  else
  {
    volimg.setAttribute('src','icons/volume-level-0.svg');
  }
});






//reset.addEventListener('click', function() {
//});



  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected


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
function getDimensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
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

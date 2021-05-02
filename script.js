// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById("user-image"); //load the canvas 
const ctx = canvas.getContext("2d"); //create the context object.
const input = document.getElementById("image-input"); //load image input file
const form = document.getElementById("generate-meme"); //load form


// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas

  var dim = getDimensions(canvas.width, canvas.height, img.width, img.height); //calculate dimensions

  ctx.fillStyle = "black";  
  ctx.fillRect(0, 0, canvas.width, canvas.height);  //fill the entire canvas with black
  
  ctx.drawImage(img, dim.startX, dim.startY, dim.width, dim.height);  //draw the image with the correct dimensions onto the canvas

});

//fires when image file is selected
input.addEventListener('change', loadImage);

function loadImage(event) { //function to update src and alt of image
  var input_file = event.target.files[0]; //select the correct input file

  if(input_file != null){
    img.src = URL.createObjectURL(input_file); //create URL to image file
    img.alt = input_file.name;  //set img alt to the file name

    URL.revokeObjectURL(input_file); //free memory allocated by URL object
  }
}

//fires when user clicks 'generate'
form.addEventListener('submit', drawText);

function drawText(event){ //function to draw text to the screen

  //select the text elements
  var toptext = document.getElementById("text-top").value;
  var bottomtext = document.getElementById("text-bottom").value;
  //select the button elements
  var clearbtn = document.getElementById("button-group").querySelector('button[type="reset"]');
  var readtxtbtn = document.getElementById("button-group").querySelector('button[type="button"]');
  var submitbtn = document.getElementById("generate-meme").querySelector('button[type="submit"]');

  //enable clear and read text buttons
  clearbtn.disabled=false;
  readtxtbtn.disabled=false;
  //disable the generate button
  submitbtn.disabled=true;

  //draw top and bottom text on the canvas
  ctx.font = "40px Comic Sans MS";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(toptext, canvas.width/2, 50);
  ctx.fillText(bottomtext, canvas.width/2, 370);

  //prevent the page from refreshing after form is submitted
  event.preventDefault();
}
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

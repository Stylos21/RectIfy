const labels = JSON.parse(localStorage.getItem("labels"));
const output = document.getElementById("output");
const context = output.getContext("2d");
const alert = document.getElementById("alert");
const previousImage = document.getElementById("left");
const nextImage = document.getElementById("right");
const textarea = document.getElementById("json");
let labelButtons = document.getElementById("labelButtons");
let boundingBoxes = output.getBoundingClientRect();
let label = labels[0];
let imageIndex = 0;
let imageLen = 0;
for (let i = 0; i < labels.length; i++){
  labelButtons.innerHTML += `
  <button id="${labels[i]}" class="label-button" onclick="selectLabel(this.id);">${labels[i]}</button>
  `
  selectLabel(labels[i]);
}
document.getElementById("btn").addEventListener("click", (e) => {
  e.preventDefault();
  const filee = document.querySelector("input[type=file]").files;
  let objects = dataPrep(filee.length);
  let oldX = 0;
  let oldY = 0;
  let x = 0;
  let y = 0;
  let width = 0;
  let height = 0;
  displayImage(imageIndex, filee);

  let isMouseDown = false;
  output.addEventListener("mousedown", mouseDown);
  // output.addEventListener("mousemove", draw);
  output.addEventListener("mouseup", mouseUp);
  function mouseDown(e) {
    oldX = e.clientX - boundingBoxes.left;
    oldY = e.clientY - boundingBoxes.top;
    objects[parseInt(imageIndex)].objectExists = 1;
    isMouseDown = true;
    output.onmousemove = (e) => {
      x = e.clientX - boundingBoxes.left;
      y = e.clientY - boundingBoxes.top;
      if (isMouseDown) {
        width = x - oldX;
        height = y - oldY;
        context.fillStyle = "#000";
        context.clearRect(0, 0, output.width, output.height);
        context.strokeRect(oldX, oldY, width, height);
        modifyJSON(objects, parseInt(imageIndex), oldX, oldY, width, height, label);

      }
    };
  }
  function mouseUp(e) {
    isMouseDown = false;
  }
});
function dataPrep(length) {
  const object = {
    objectExists: 0,
    midPointX: 0,
    midPointY: 0,
    width: 0,
    height: 0,
  };
  let arr = [];
  for(let i = 0; i < labels.length; i++){
    object[labels[i]] = 0;
  }
  for (j = 0; j < length; j++) {
    arr.push(JSON.parse(JSON.stringify(object)));
  }
  return arr;
}

function displayImage(imageIndex, file) {
  imageLen = file.length;
  var reader = new FileReader();
  reader.onloadend = () => {
    var img = new Image();
    img.onload = function () {
      img.width = 250;
      img.height = 250;

      // context.drawImage(img, 0, 0, 250, 250);
    };
    img.src = event.target.result;
    if (img.src.includes("image")) {
      output.style.backgroundImage = `url(${img.src})`;
      alert.innerHTML = "";
    } else alert.innerHTML = "Invalid image!";
    output.style.backgroundRepeat = "no-repeat";
    output.style.backgroundSize = "250px 250px";
    // output.style.height = "250px";
  };

  if (file[parseInt(imageIndex)]) reader.readAsDataURL(file[parseInt(imageIndex)]);
  else output.src = "";
}
previousImage.addEventListener("click", (e) => {
  if (imageIndex >= 1) {
    imageIndex--;
    displayImage(parseInt(imageIndex), document.querySelector("input[type=file]").files);
  }
});
nextImage.addEventListener("click", (e) => {
  if (imageIndex < imageLen) {
    imageIndex++;
    context.clearRect(0, 0, output.width, output.height);
    displayImage(parseInt(imageIndex), document.querySelector("input[type=file]").files);
  }
});

function modifyJSON(obj, imageIndex, x, y, width, height, label) {
  obj[parseInt(imageIndex)]["midPointX"] = (x + width / 2) / output.width;
  obj[parseInt(imageIndex)]["midPointY"] = (y + height / 2) / output.height;
  obj[parseInt(imageIndex)]["width"] = Math.abs(width / output.width);
  obj[parseInt(imageIndex)]["height"] = Math.abs(height / output.height);
  obj[parseInt(imageIndex)][label] = 1;
  textarea.innerHTML = JSON.stringify(obj);
}
function selectLabel(id){
  console.log("AAAAA")
  let buttons = document.getElementsByClassName("label-button");
  label = id;
  for(let i = 0; i < buttons.length; i++){
    if(buttons[i].id == label){
      buttons[i].classList.add("selected");
    }
    else{
      buttons[i].classList.remove("selected");

    }
  }
}
function copy(){
  textarea.select();
  document.execCommand("copy");
}

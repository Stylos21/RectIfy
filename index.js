let labels = [];
localStorage.getItem("labels") === null ? localStorage.setItem("labels", JSON.stringify(labels)) : {};
labels = JSON.parse(localStorage.getItem("labels"));
const submit = document.querySelector("#submit");
const input = document.querySelector("#labelInput");
const labelList = document.querySelector("#labelList");
overwrite();
const alert = document.querySelector("#alert");
const modal = document.querySelector("#modal");
const submitNewClass = document.querySelector(".changeLabel");
let delButtons = [];
submit.addEventListener("click", (e) => {
  e.preventDefault();
  let status = "";
  input.value == ""
    ? (status = "Invalid class name - Please provide a class name.")
    : labels.includes(input.value)
    ? (status = "Invalid class name - Class already exists!")
    : labels.unshift(input.value);
    
  localStorage.setItem("labels", JSON.stringify(labels));  
  alert.innerHTML = status;
  input.value = "";
  overwrite();

 
});

function overwrite() {
  labelList.innerHTML = "";
  labels.map((label) => {
    labelList.innerHTML += `
   <li style="box-shadow: 5px 10px grey;">
   <p>${label}</p>
   <ul class="icon" style="margin-left:auto;">
   
   <li><button onclick="toggleModal(this.id)" edit-class class="edit" id="${label}_edit"><i class="fas fa-edit" style="float:right;"></i></button></li>
   <li><button onclick="delClass(this.id)" trash-class id="${label}_del" class="trash"><i class="fas fa-trash" style="float:right;"></i></button></li>
   </ul>


   </li>`;
   
  });
  localStorage.setItem("labels", JSON.stringify(labels));
  
}
function delClass(id){
  let index = labels.indexOf(id.split("_")[0]);
  labels.pop(index, 1);
  overwrite();  
}

function toggleModal(id){
  if (modal.style.display === "none") {
    modal.style.display = "block";
    document.querySelector("#newLabel").value = "";
    submitNewClass.id = id.split("_")[0];

  } else {
    
    modal.style.display = "none";
  }
}
function editLabel(id){
  let newLabelInput = document.querySelector("#newLabel").value;
  let oldLabelIndex = labels.indexOf(id);
  input.value = "";
  labels[oldLabelIndex] = newLabelInput;
  localStorage.setItem("labels", JSON.stringify(labels));
  modal.style.display = "none";
  overwrite();
  

}
function redirect(){
  if(labels.length > 0){
    window.location.href = "test.html";
  }
  else{
    alert.innerHTML = "Error - Provide at least one label!"
  }
}
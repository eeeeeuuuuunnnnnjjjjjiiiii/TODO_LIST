//유저가 값을 입력한다
// + 버튼을 클릭하면 할일이 추가된다
// 유저가 delete버튼을 누르면 할일이 삭제된다
//check버튼을 누르면 할일이 끝나면서 밑줄이 간다
//1.check버튼을 클릭하는 순간 true false
//2. true이면 끝난걸로 간주하고 밑줄 보여주기
//3.false이면 안끝난걸로 간주하고 그대로
//진행중 끝남 탭을 누르면 언더바가 이동한다
//끝남탭은 끝난 아이템만 진행중탭은 진행중인 아이템만나온다
//전체탭을 누르면 다시 전체아이템으로 돌아옴
//할일을 입력하고나면 입력창이 자동으로 비워지는 로직을 추가하셨으면 좋겠습니다!
//입력한 할일이 없다면 추가가 안되게 막게 하는 기능도 추가해주세요! 
// 버튼을 disable 시키던가 아니면 에러메세지 보여주는 형식으로
let userInput = document.querySelector(".task-input");
let addButton = document.querySelector(".button-add");
let tabs = document.querySelectorAll(".tab-type div");
let underLine = document.getElementById("tab-underline");
let taskList = [];
let mode = "all";
let filterList = [];

addButton.addEventListener("click", addTask);
userInput.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    addTask(event);
  }
});
for (let i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function (event) {
    filter(event);
  });
}

function addTask() {
  let taskValue = userInput.value.trim(); // Trim leading and trailing whitespaces
  if (taskValue === "") return alert("할일을 입력해주세요");

  let task = {
    content: taskValue,
    isComplete: false,
    id: randomIDGenerator(),
  };

  taskList.push(task);
  userInput.value = "";
  render();
}

function render() {
  let result = "";
  let list = mode === "all" ? taskList : filterList;

  for (let i = 0; i < list.length; i++) {
    let task = list[i];
    result += `<div class="task ${task.isComplete ? 'task-done' : ''}" id="${task.id}" ondblclick="editTask('${task.id}')">
            <span>${task.content}</span>
            <div class="button-box">
              <button onclick="toggleDone('${task.id}')"><i class="fa fa-${task.isComplete ? 'undo-alt' : 'check'}"></i></button>
              <button onclick="deleteTask('${task.id}')"><i class="fa fa-trash"></i></button>
            </div>
        </div>`;
  }

  document.getElementById("task-board").innerHTML = result;
}

function editTask(id) {
  let task = taskList.find(task => task.id === id);
  if (!task) return;

  let taskElement = document.getElementById(id);
  let taskContent = taskElement.querySelector("span");

  let inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.value = task.content;

  inputElement.addEventListener("blur", function () {
    finishEditing(task, inputElement.value);
  });

  inputElement.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
      finishEditing(task, inputElement.value);
    }
  });

  taskContent.innerHTML = "";
  taskContent.appendChild(inputElement);
  inputElement.focus();
}

function finishEditing(task, newContent) {
  task.content = newContent.trim(); 
  render();
}

function toggleDone(id) {
  let task = taskList.find(task => task.id === id);
  if (task) {
    task.isComplete = !task.isComplete;
    render();
  }
}

function deleteTask(id) {
  let index = taskList.findIndex(task => task.id === id);
  if (index !== -1) {
    taskList.splice(index, 1);
    render();
  }
}

function filter(e) {
  if (e) {
    mode = e.target.id;
    underLine.style.width = e.target.offsetWidth + "px";
    underLine.style.left = e.target.offsetLeft + "px";
    underLine.style.top = e.target.offsetTop + (e.target.offsetHeight - 4) + "px";
  }

  if (mode === "ongoing") {
    filterList = taskList.filter(task => !task.isComplete);
  } else if (mode === "done") {
    filterList = taskList.filter(task => task.isComplete);
  } else {
    filterList = [];
  }

  render();
}

function randomIDGenerator() {
  return "_" + Math.random().toString(36).substr(2, 9);
}
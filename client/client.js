const status = document.querySelector(".status");
const button = document.getElementById("send");
const messages = document.querySelector(".messages");
const close = document.getElementById("close");
const username = document.getElementById("user");

//Get username from localstorage and display it
let user = localStorage.getItem("user");
username.textContent = user;
user = username.textContent;

//create websocket
let socket = new WebSocket("ws://localhost:5500");

//Check if connection was established
socket.onopen = function (e) {
  status.textContent = "Connected to server!";
};

//Automatically scroll to Bottom
window.onload = toBottom;
function toBottom() {
  messages.scrollTop = messages.scrollHeight;
}

//Send message to server
button.onclick = () => {
  if (socket.readyState == 1) {
    //let user = document.getElementById("user");
    let message = document.getElementById("message");
    const date = new Date();
    //create obj
    const msg = {
      user: user,
      message: message.value,
      time: date.toLocaleTimeString(),
    };
    socket.send(JSON.stringify(msg));
  }
  message.value = "";
};

//Receive message from server (or) other clients
socket.onmessage = function (event) {
  var json = JSON.parse(event.data);
  let client = json.user;
  let msg = json.message;
  //let time = json.time;

  //Insert incoming data in messages box
  if (client != user) {
    messages.innerHTML += `
  <div class='speechbubble other'>
  <p>
      ${msg}
      <span class='username'>${user}</span>
  </p>
  </div>`;
  } else
    messages.innerHTML += `
  <div class='speechbubble own'>
  <p>
      ${msg}
  </p>
  </div>`;
};

//If user wants to close connection to server
close.onclick = function (e) {
  e.preventDefault();
  socket.close(1000, "Connection terminated by client");
  status.innerHTML = "Connection terminated";
  status.classList.replace("status", "closed");
  return false;
};

socket.onclose = function (event) {
  status.innerHTML = "Connection terminated";
  status.classList.replace("status", "closed");

  if (event.wasClean) {
    console.log(
      `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
    );
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log("[close] Connection died");
  }
};

socket.onerror = function (error) {
  console.log(`[error]`);
};

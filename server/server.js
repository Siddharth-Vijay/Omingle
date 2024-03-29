const http = require("http");
const ws = require("ws");

const wss = new ws.Server({ noServer: true });

function accept(req, res) {
  // all incoming requests must be websockets
  if (
    !req.headers.upgrade ||
    req.headers.upgrade.toLowerCase() != "websocket"
  ) {
    res.end();
    return;
  }

  // can be Connection: keep-alive, Upgrade
  if (!req.headers.connection.match(/\bupgrade\b/i)) {
    res.end();
    return;
  }

  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect);
}

function onConnect(ws) {
  ws.on("message", function (message) {
    wss.clients.forEach(function each(client) {
      message = message.toString();
      client.send(message);

      console.log(JSON.parse(message));
    });

    //setTimeout(() => ws.close(1000, "Bye!"), 5000);
  });
}

if (!module.parent) {
  http.createServer(accept).listen(5500);
} else {
  exports.accept = accept;
}

//80 --> http
//443 --> https

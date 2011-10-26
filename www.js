var http = require('http'), 
    fs = require("fs"), 
    index = 
"<html><head><title>www.possienka.de</title></head>"+
"<body><h1>Willkommen</h1>"+
"<ul>"+
"  <li><a href='http://mmr.possienka.de/'>Marble Madness Redux</li>"+
"  <li><a href='https://github.com/RicoP/Marble-Madness-Redux/'>Github</a></li>"+
"</ul>"+
"</body></html>", 
ico = fs.readFileSync("./favicon.ico"); 

http.createServer(function (req, res) {
  if(req.url === "/favicon.ico") {
    res.writeHead(200, {"Content-Type" : "image/vnd.microsoft.icon"}); 
    res.end(ico); 
  }
  else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
  }
}).listen(8001, "127.0.0.1");

process.title = "node www"; 
console.log("WWW gestartet"); 


var http = require('http');
var index = 
"<html><head><title>www.possienka.de</title></head>"+
"<body><h1>Willkommen</h1>"+
"<ul>"+
"  <li><a href='http://mmr.possienka.de/'>Marble Madness Redux</li>"+
"  <li><a href='https://github.com/RicoP/Marble-Madness-Redux/'>Github</a></li>"+
"</ul>"+
"</body></html>";  


http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);
}).listen(8001, "127.0.0.1");

process.title = "node www"; 
console.log("WWW gestartet"); 


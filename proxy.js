var httpProxy = require("http-proxy"); 

httpProxy.createServer({
  hostnameOnly: true,
  router: {
    'possienka.de' : '127.0.0.1:8001',
    'www.possienka.de' : '127.0.0.1:8001',
    'gamejam1109.possienka.de' : '127.0.0.1:8003',  
    'mmr.possienka.de' : '127.0.0.1:8004', 
    'se2demo.possienka.de' : '127.0.0.1:8005',
    'temp.possienka.de' : '127.0.0.1:8006' 
  }
}).listen(80); 

process.title = "node proxy"; 
console.log("Proxy gestartet."); 

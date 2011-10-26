var http = require('http'),
    fs = require("fs"), 
    game = require("./game.js"), 
    path = require("path"), 
    urlParser = require("url").parse, 
    subdomainHandler = {};   

initFiles(subdomainHandler); 

http.createServer(function(req, res) {
  var subdomain = req.headers.host.split(/\./)[0],
      handlerList = subdomainHandler[subdomain], 
      parsedUrl = urlParser(req.url, true);  

  if(!handlerList) {
    //subdomain doesn't exist 
    redirectToWww(req, res);
    return; 
  }

  console.log(parsedUrl); 

  handler = handlerList[parsedUrl.pathname]; 

  if(!handler) {
    redirect404(req, res); 
    return; 
  }

  handler(req, res); 
}).listen( 8001, "127.0.0.1" ); 


function redirectToWww(req, res) {
  var
   fullUrl = req.headers.host + req.url;  
   newUrl = fullUrl.replace(/.*possienka\.de/, "http://www.possienka.de"); 

console.log(req.headers.host + req.url + " to " + newUrl); 
  res.writeHead(302, {"Location" : newUrl});
  res.end(""); 
}

function redirect404(req, res) {
  res.writeHead(404, {}); 
  res.end("404: " + req.url + " Not found. " + new Date()); 
}

function initFiles(files) {
  var subdirs = fs.readdirSync("http");
  for(var i = 0; i != subdirs.length; i++) {
    var subdir = subdirs[i]; 
    if(!subdir)
      continue; 

    var dir = "http/" + subdir; 
    var stat = fs.statSync(dir); 
    if(stat.isDirectory())
      files[subdir] = syncDir(dir); 
  }  
}

function syncDir(dir) {
  console.log(dir); 
  var handler = {}; 
  var files = fs.readdirSync(dir); 
  for(var i = 0; i != files.length; i++) {
    if(!files[i])
      continue; 

    (function(file) {
      var stat = fs.statSync(file), 
          base = path.basename(file); 
      if(!stat.isFile())
        return; 

      handler["/" + base] = createFileHandler(file);
    })(dir + "/" + files[i]);
  }

  handler["/"] = handler["/index.html"]; 
  handler["/state"] = game.stateHandler; 
  handler["/action"] = game.actionHandler; 

  return handler; 
}

function createFileHandler(file) {
  return function(req, res) {
    readLocalFile(req, res, file); 
  };
}

function readLocalFile(req, res, file) {
  console.log(req.url + "-->" + file);
  fs.readFile(file, function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'}); 
    if(err) {
      res.write(JSON.stringify(err)); 
    }
    else {
      res.write(data); 
    }
    res.end(""); 
  }); 
}












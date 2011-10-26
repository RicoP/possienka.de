"use strict";
var urlParser = require("url").parse, 
    borders = [600, 360]; 

Array.prototype.contains = function (f) {
    var i = 0;
    for (i in this) {
        if (f(this[i])) {
            return true;
        }
    }
    return false;
};

Array.prototype.first = function(f) {
  var i, o; 
  for(i = 0; i != this.length; i++) {
    o = this[i]; 
    
    if(!o)
      continue; 

    if(f(o))
      return o; 
  }

  return null; 
};

var o = generateNewState(); 
 
exports.stateHandler = function (req, res) {
  res.end(JSON.stringify(o));
};

exports.actionHandler = function (req, res) {
  var query = urlParser(req.url, true).query, 
      player, node; 

  if (query.name && query.id) {
    for(var i = 0; i != o.nodes.length; i++) { 
      if(o.nodes[i] && (o.nodes[i].id == query.id)) {
        node = o.nodes[i]; 
      }
    }

    if(!node) {
      console.log("node " + query.id + " doesn't exist :("); 
      res.end(JSON.stringify(o));
      return; 
    }

    player = o.player[query.name]; 

    if(!player) {
      //New Player! 
      console.log("new Player " + query.name); 
      player = o.player[query.name] = {"nodes":[], "points":0};
    }

    var detected = Math.random() < (node.risk / 100.0); 
    console.log(detected); 

    player.nodes.push( {"id" : query.id, "detected":detected} );
    //player.points += node.points;
    recalculatePoints();  
    removeNodesExcept(query.id, query.name); 

    if(player.points >= 200) 
      gameover(); 
  }

  res.end(JSON.stringify(o));
};

function removeNodesExcept(id, exceptName) {
  for(var name in o.player) {
    if(name === exceptName) 
      continue; 

    var player = o.player[name]; 
    console.log(player.nodes); 
      player.nodes = player.nodes.filter(function(n) { return n.id !== id; });   
    console.log(player.nodes); 
  }
}

function recalculatePoints() {
  for(var name in o.player) {
    console.log(name); 
    var p = o.player[name]; 
    p.points = 0; 

    if(p.nodes)
      for(var i = 0; i != p.nodes.length; i++) {
        var n = p.nodes[i]; 
        p.points += o.nodes[n.id].points; 
      }

    console.log(name + " has points " + p.points); 
  }
}

function generateNewState() {
  var nodes = []; 

  for(var n = 0; n != 50; n++) {
    var xy = getNewNode(nodes), 
        p  = ~~((Math.random() * 9) + 1) * 10; 
    nodes.push( {"id":n, "x":xy[0], "y":xy[1], "points":p/2,"risk":p/2} ); 
  }

  console.log(nodes); 

  return {
    "nodes" : nodes,
    "player": {},
    "token" : (new Date()).valueOf()
  };
}

function getNewNode(nodes) {
  var x = ~~(Math.random() * borders[0]), 
      y = ~~(Math.random() * borders[1]); 

  for(var i = 0; i != nodes.length; i++) {
    if( Math.abs(nodes[i].x - x) < 40 && Math.abs(nodes[i].y - y) < 40 )
      return getNewNode(nodes); 
  }

  return [x,y]; 
}

function gameover() {
  o.gameover = true; 

  setTimeout(function() {
    //o = generateNewState(); 
  }, 5000); 
}

window.onload = main;

function main() {
	var gl = MM.getGlContext("gl"), glUtil = null, userData = {};

	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(/* function */callback, /* DOMElement */element) {
			window.setTimeout(callback, 1000 / 60);
		};

	})();

	if(!gl)
		alert("WebGL not Supported :(");
	glUtil = new MM.GlUtil(gl);

	init(gl, glUtil, userData); (function animloop() {
		draw(gl, glUtil, userData);
		requestAnimFrame(animloop);
	})();
}

function draw(gl, glUtil, userData) {
	if(!userData.triangle) {
		userData.triangle = {};
		bindTriangleBuffer(gl, userData.triangle);
	}

	gl.viewport(0, 0, 640, 480);

	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(userData.program);

	// Bind the vertex data
	gl.bindBuffer(gl.ARRAY_BUFFER, userData.triangle.vertexBuffer);
	gl.vertexAttribPointer(userData.vertexAttribLoc, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(userData.vertexAttribLoc);

	gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function bindTriangleBuffer(gl, triangle) {
	var vVertices = new Float32Array([0.0, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0]);

	triangle.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangle.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vVertices, gl.STATIC_DRAW);
}

function init(gl, glUtil, userData) {
	var vertexShader, fragmentShader, program, linked;
	vertexShader = glUtil.loadShader("vs");
	fragmentShader = glUtil.loadShader("fs");
	program = gl.createProgram();

	if(!program) {
		throw "couldn't create program";
	}

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);

	gl.linkProgram(program);
	linked = gl.getProgramParameter(program, gl.LINK_STATUS);

	if(!linked) {
		throw "Couldn't link program: " + gl.getProgramInfoLog(program);
	}

	userData.program = program;
	userData.vertexAttribLoc = gl.getAttribLocation(program, "vPosition");

	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	//DEBUG
	window.program = program;
	window.gl = gl;

	return true;
}
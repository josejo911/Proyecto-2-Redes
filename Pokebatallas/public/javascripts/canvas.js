// This file manages the game's logic for most visual things and contains various functions
// for drawing on and manipulating the canvas, used by the game client.
//////////  Constructors  \\\\\\\\\\
function Label(position, text, size, visible, clickable, disabled, font, callback) {
	if (logFull) console.log("%s(%j)", arguments.callee.name, Array.prototype.slice.call(arguments).sort());
		//x and y are integers betweem 0 and 1. Use as percentages.
this.position = position;
	this.text = text;
	this.size = size;
	this.visible = visible;
	this.clickable = clickable;
	this.disabled = disabled;
	this.down = false;
	this.font = font;
	this.callback = callback;
}
var jugadores = [];
//import {playerObject} from '../../libs/game_manager'
var nombres = prompt("Cual es tu nombre?");//####################
//var nombres = require('./game_client');
//import nombres from './game_client'

//export {nombres};
//var usuarios = String.toUpperCase(usuario);
var bienvenida = ("Entrenador " + nombres.toUpperCase());
//console.log(playerObject);


jugadores.push(nombres);
//var username = prompt(jugadores);
//player2 = jugadores.slice(0,1);
//console.log(player1);
//var versus = (player1 +" + "+player2);
//////////  Canvas  \\\\\\\\\\
mensajes = [];
function envio() {
	var x = document.getElementById("mensaje").value;
	mensajito = nombres+": " + x;
	mensajes.push(mensajito);
	document.getElementById("mensaje").value = "";
	//labels["mensaje"] = new Label({x: 0.5, y: 0.5}, mensajes, 80, false, false, false, "PokemonHollow");
	var w = "";
	w = mensajes;
	//w = w.replace(",","<br>");
	alert(mensajes);
	//document.getElementById("respuesta").innerHTML = w;
}

function init() {
	if (logFull) console.log("%s(%j)", arguments.callee.name, Array.prototype.slice.call(arguments).sort());
	canvas = document.getElementById("game-canvas");
	ctx = canvas.getContext("2d");

	//canvas2 = document.getElementById("game-canvas2");
	//ctx2 = canvas2.getContext("2d");

	handleResize();
	handSlots = [];
	for (var i = 1; i < 6; i++) {
		handSlots.push({
			position: {
				x: canvas.width / 6 * i - cardWidth / 2,
				y: canvas.height - cardHeight * 1.1
			},
			card: undefined
		});
	}

	labels["logo"] = new Label({x: 0.5, y: 0.3}, "Poke Batalla!!", 192, true, false, false, "PokemonHollow");
	labels["play"] = new Label({x: 0.5, y: 0.7}, "Luchar!", 144, true, true, false, "PokemonHollow", enterQueue);
	labels["searching"] = new Label({x: 0.5, y: 0.7}, "Buscando", 100, false, false, false, "PokemonHollow");
	labels["result"] = new Label({x: 0.5, y: 0.3}, "", 192, false, false, false, "PokemonHollow");
	labels["rematch"] = new Label({x: 0.5, y: 0.62}, "Luchar", 128, false, false, false, "PokemonHollow", requestRematch);
	labels["waiting"] = new Label({x: 0.5, y: 0.62}, "Esperando", 128, false, false, false, "PokemonHollow");
	labels["main menu"] = new Label({x: 0.5, y: 0.78}, "Menu", 128, false, false, false, "PokemonHollow", exitMatch);
	labels["timer"] = new Label({x: 0.5, y: 0.1}, 20, 64, false, false, false, "PokemonHollow");
	labels["nombre"] = new Label({x: 0.2, y: 0.05}, bienvenida, 80, true, false, false, "PokemonHollow");
	//labels["vs"] = new Label({x: 0.2, y: 0.5}, "holaaaaaaaaaaa", 80, true, false, false, "PokemonHollow");

	labels["jugador"] = new Label({x: 0.2, y: 0.05}, nombres, 80, false, false, false, "PokemonHollow");
	labels["vs"] = new Label({x: 0.5, y: 0.5}, "hola", 80, false, false, false, "PokemonHollow");
	labels["chat"] = new Label({x: 0.5, y: 0.5}, "hola", 80, false, false, false, "PokemonHollow");
	
	//nombrecito = new string(nombres);
	//#####################label vrs#################################
	
	//labels["vs"] = new Label({x: 0.5, y: 1.2}, "versus", 80, true, false, false, "PokemonHollow");
	
	//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

}

function animate() {
	requestAnimFrame(animate);
	draw();
}

//////////  Events  \\\\\\\\\\
function handleMouseMove(event) {
	for (var i = 0; i < handSlots.length; i++) {
		if (isOnSlot(event, handSlots[i])) {
			if (!clickCursor) {
				$("#game-canvas").css("cursor", "pointer");
				clickCursor = true;
			}
			return;
		}
	}

	for (i in labels) {
		if (isOnLabel(event, labels[i])) {
			if (!clickCursor) {
				$("#game-canvas").css("cursor", "pointer");
				clickCursor = true;
			}
			return;
		} else {
			labels[i].down = false;
		}
	}

	$("#game-canvas").css("cursor","auto");
	clickCursor = false;
}

function handleMouseDown(event) {
	if (logFull) console.log("%s(%j)", arguments.callee.name, Array.prototype.slice.call(arguments).sort());
	for (i in labels) {
		if (isOnLabel(event, labels[i]) && labels[i].clickable && !labels[i].disabled) {
			labels[i].down = true;
			return;
		}
	}
}

function handleMouseUp(event) {
	if (logFull) console.log("%s(%j)", arguments.callee.name, Array.prototype.slice.call(arguments).sort());
	for (i in labels) {
		if (labels[i].down) {
			labels[i].down = false;
			if (labels[i].callback && labels[i].clickable) {
				labels[i].callback();
			}
		}
	}


	for (var i = 0; i < 20; i++) {
		if (isOnSlot(event, handSlots[i])) {
			playCard(i);
			playerCard = handSlots[i].card;
			handSlots[i].card = undefined;
			return;
		}
	}
	handleMouseMove(event);
}

function isOnSlot(event, slot) {
	var x = (event.pageX - canvas.offsetLeft),
		y = (event.pageY - canvas.offsetTop);
	if (slot.card && canPlayCard) {
		if (x > slot.position.x && x < slot.position.x + cardWidth &&
			y > slot.position.y && y < slot.position.y + cardHeight) {
			return true;
		}
	}
	return false;
}

function isOnLabel(event, label) {
	var x = (event.pageX - canvas.offsetLeft),
		y = (event.pageY - canvas.offsetTop);
	if (label.clickable) {
		var labelWidth = label.text.length * label.size * r * 0.4;
		var labelHeight = label.size * r;
		var leftBoundary = label.position.x * canvas.width - labelWidth / 2;
		var rightBoundary = label.position.x * canvas.width + labelWidth / 2;
		var upperBoundary = label.position.y * canvas.height - labelHeight / 2;
		var lowerBoundary = label.position.y * canvas.height + labelHeight / 2;

		if (x > leftBoundary && x < rightBoundary &&
			y > upperBoundary && y < lowerBoundary) {
			return true;
		}
	}
	return false;
}

function handleResize() {
	if (logFull) console.log("%s(%j)", arguments.callee.name, Array.prototype.slice.call(arguments).sort());
	if (window.innerWidth < window.innerHeight * aspect) {
		canvas.width = window.innerWidth * 0.9;
		canvas.height = window.innerWidth * 0.9 / aspect;
		r = canvas.width / 1000;
	} else {
		canvas.width = window.innerHeight * 0.9 * aspect;
		canvas.height = window.innerHeight * 0.9;
		r = canvas.height * aspect / 1000;
	}
	cardWidth = 120 * r;
	cardHeight = cardWidth * 1.5;
	if (handSlots) {
		for (var i = 1; i < 6; i++) {
			handSlots[i-1].position = {
				x: canvas.width / 6 * i - cardWidth / 2,
				y: canvas.height - cardHeight * 1.1
			};
		}
	}
	playerCardPosition = {x: canvas.width * 0.17, y: canvas.height * 0.15};
	opponentCardPosition = {x: canvas.width * 0.83 - cardWidth * 1.5, y: canvas.height * 0.15};
}

//////////  Drawing  \\\\\\\\\\
function draw() {
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//ctx2.fillRect(10, 10, 1000000, 10000000);
	//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	//drawChat();
	///%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	for (var i = 0; i < handSlots.length; i++) {
		if (displayCardSlots) {
			if (handSlots[i].card) {
				drawCard(handSlots[i].card, handSlots[i].position, 1);
			} else {
				drawEmptySlot(handSlots[i]);
			}
		}
	}
	drawPoints();
	if (playerCard) {
		//console.log(playerCard);
		drawCard(playerCard, playerCardPosition, 1.5);
	}
	if (opponentCard) {
		if (opponentCard.isUnknown) {
			drawUnknownCard(opponentCardPosition, 1.5);
		} else {
			drawCard(opponentCard, opponentCardPosition, 1.5);
		}
	}
	for (i in labels) {
		if (labels[i].visible) {
			drawLabel(labels[i]);
		}
	}
}

//function drawChat(){
//	ctx.fillStyle = "#ffffff";
//	ctx.fillRect(canvas.width/2, canvas.height/2, canvas.width/3, canvas.height/3);

//}

function addnombre(playerObject){
	playerObject["nombrecito"] = nombres;
	return playerObject;

}

function drawCard(card, position, scale) {
	if (!scale) {
		scale = 1;
	}
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.fillStyle = "#070054";
	//ctx.fillStyle = typeImage[card.type];
	ctx.fillRect(position.x, position.y, cardWidth * scale, cardHeight * scale);
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 2 * scale * 0.1;
	ctx.strokeRect(position.x, position.y, cardWidth * scale, cardHeight * scale);
	ctx.fillStyle = "#190f87";
	//ctx.fillStyle = ctx.createPattern(typeImage[card.type], "repeat");
	
	ctx.fillRect(position.x + cardWidth * scale * 0.1, position.y + cardHeight * scale * 0.067, cardWidth * scale * 0.8, cardHeight * scale * 0.866);
	ctx.drawImage(typeImage[card.type], position.x + cardWidth * scale * 0.1, position.y + cardHeight * scale * 0.067, cardWidth * scale * 0.8, cardHeight * scale * 0.866);
	
	ctx.fillStyle = typeColors[card.type];
	ctx.font = "bold " + (30 * scale * r) + "px chinese_takeaway";
	ctx.fillText(card.power, position.x + cardWidth * scale / 1.2, position.y + cardHeight * scale * 0.15);
	ctx.font = (15 * scale * r) + "px Arial";
	ctx.fillText(types[card.type], position.x + cardWidth * scale / 2, position.y + cardHeight * scale * 0.95);
}

function drawPointCard(card, position, scale) {
	if (!scale) {
		scale = 1;
	}
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.fillStyle = colors[card.color];
	ctx.fillRect(position.x, position.y, cardWidth * scale, cardWidth * scale);
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 4 * scale * r;
	ctx.strokeRect(position.x, position.y, cardWidth * scale, cardWidth * scale);
	ctx.fillStyle = typeColors[card.type];
	//ctx.drawImage(bulbasaur, 100, 0, 200, 200)
	ctx.font = "bold " + (72 * scale * r) + "px Arial";
	ctx.fillText(types[card.type][0], position.x + cardWidth * scale / 2, position.y + cardWidth * scale * 0.5);
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 3 * r * scale;
	ctx.strokeText(types[card.type][0], position.x + cardWidth * scale / 2, position.y + cardWidth * scale * 0.5);
}

function drawUnknownCard(position, scale) {
	if (!scale) {
		scale = 1;
	}
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.fillStyle = "#6f6f6f";
	ctx.fillRect(position.x, position.y, cardWidth * scale, cardHeight * scale);
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 2 * scale * r;
	ctx.strokeRect(position.x, position.y, cardWidth * scale, cardHeight * scale);
	ctx.fillStyle = "#a0a0a0";
	ctx.fillRect(position.x + cardWidth * scale * 0.1, position.y + cardHeight * scale * 0.067, cardWidth * scale * 0.8, cardHeight * scale * 0.866);
	ctx.fillStyle = "#d1d1d1";
	ctx.font = "bold " + (72 * r * scale) + "px " + labelFont;
	ctx.fillText("?", position.x + cardWidth * scale / 2, position.y + cardHeight * 0.5 * scale);
}

function drawEmptySlot(slot) {
	ctx.fillStyle = "#a0a0a0";
	ctx.fillRect(slot.position.x, slot.position.y, cardWidth, cardHeight);
	ctx.strokeStyle = "#000000";
	ctx.strokeRect(slot.position.x, slot.position.y, cardWidth, cardHeight);
}
///cartas de los puntos%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function drawPoints() {
	for (var i = 0; i < playerPoints.length; i++) {
		for (var j = playerPoints[i].length - 1; j >= 0; j--) {
			drawPointCard(playerPoints[i][j], {x: cardWidth * 0.55 * i + 5 * r, y: cardHeight * 0.5 * j * 0.2 + 5 * r}, 0.5);
		}
	}

	for (var i = 0; i < opponentPoints.length; i++) {
		for (var j = opponentPoints[i].length - 1; j >= 0; j--) {
			drawPointCard(opponentPoints[i][j], {x: canvas.width - cardWidth * 0.55 * (3-i) - 5 * r, y: cardHeight * 0.5 * j * 0.2 + 10 * r}, 0.5);
		}
	}
}

function drawLabel(label) {
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.font = (label.size * 0.5) + "px " + label.font;
	var shadowDistance = label.size / 100;
	if (!label.disabled) {
		ctx.fillStyle = "#000000";
		ctx.fillText(label.text, canvas.width * label.position.x + (shadowDistance * r), canvas.height * label.position.y + (shadowDistance * r));
		ctx.fillStyle = "#c90000";
	} else {
		ctx.fillStyle = "#000000";
	}
	if (label.down) {
		ctx.fillText(label.text, canvas.width * label.position.x + (shadowDistance * 0.5 * r), canvas.height * label.position.y + (shadowDistance * 0.5 * r));
	} else {
		ctx.fillText(label.text, canvas.width * label.position.x, canvas.height * label.position.y);
	}
}

//////////  Initialize  \\\\\\\\\\
window.requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
		   window.webkitRequestAnimationFrame ||
		   window.mozRequestAnimationFrame ||
		   window.oRequestAnimationFrame ||
		   window.msRequestAnimationFrame ||
		   function (callback, element) {
			   window.setTimeout(callback, 1000 / 60);
		   };
})();



var bulbasaur = new Image();
bulbasaur.src = "../images/bulbasaur.png";
var charmander = new Image();
charmander.src = "../images/charmander.png";
var squirtle = new Image();
squirtle.src = "../images/squirtle.png";

var handSlots, canvas, ctx, horizontalCenter, verticalCenter, clickPos, clickedCard, cardWidth, cardHeight, playerCardPosition, opponentCardPosition;
var clickCursor = false,
	displayCardSlots = false,
	aspect = 20 / 10,
	labels = [],
	labelFont = "PokemonHollow";
var typeColors = ["#de6007", "#91f2e0", "#14e05c"];
var typeImage = [charmander, squirtle, bulbasaur]
var types = ["Charmander", "Squirtle", "Bulbasaur"];
var colors = {"yellow": "#fdee00", "orange": "#ffb235", "green": "#52a546", "blue": "#246acd", "red": "#e02929", "purple": "#9738af"};

init();
animate();

window.addEventListener("resize", handleResize, false);
canvas.addEventListener("mousemove", handleMouseMove, false);
canvas.addEventListener("mousedown", handleMouseDown, false);
canvas.addEventListener("mouseup", handleMouseUp, false);
setInterval(animateLabels, 300);

// Variables to store the current input and the result
let currentInput = '0';
let operator = '';
let previousInput = '';

// Update the display
function updateDisplay(value) {
    document.getElementById('display').textContent = value;
}

// Append a number or operator to the display
function appendToDisplay(value) {
    if (currentInput === '0') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    updateDisplay(currentInput);
}

// Clear the display and reset variables
function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    updateDisplay(currentInput);
}

// Calculate the result of the current expression
function calculateResult() {
    try {
        // Use eval to evaluate the expression
        currentInput = eval(currentInput).toString();
    } catch (e) {
        currentInput = 'Error';
    }
    updateDisplay(currentInput);
}

////////////////////////////////////////////////////////////////////////////////
console.clear();

let canvas, canvasCtx;
let canvasSize = [0, 0], scale = 1;
let state;

main();

////////////////////////////////////////////////////////////////////////////////
function main(){
	canvas = document.createElement('canvas');
	document.body.appendChild(canvas);
	document.body.style.margin = '0';
	canvas.style.display = 'block';
	
	canvasCtx = canvas.getContext('2d');
	
	state = createState();
	
	setupControls();
	
	requestAnimationFrame(mainLoop);
	
	function mainLoop(){
		tick();
		requestAnimationFrame(mainLoop);
	}
}

function setupControls(){
	canvas.addEventListener('mousemove', (e) => {
		const x = e.offsetX - canvasSize[0] / 2;
		const y = e.offsetY - canvasSize[1] / 2;
		const m = 3;
		state.vel = [-x * m, -y * m];
	});
}

function createState(){
	const state = {
		time: 0,
		timeDelta: 1 / 60,
		asteroidLimit: 50,
		spawnProb: 0.0001,
		nToSpawn: 0,
		asteroids: [],
		vel: [8, 128],
	};
	return state;
}

function tick(){
	checkResizeAndInit();
	canvasCtx.fillStyle = '#000000';
	canvasCtx.fillRect(0, 0, canvasSize[0], canvasSize[1]);
	
	state.time += state.timeDelta;
	
	respawnAsteroids();
	moveAsteroids();
	
	drawAsteroids();
}

function checkResizeAndInit(){
	if(
		window.innerWidth === canvasSize[0] &&
		window.innerHeight === canvasSize[1]
	) return;
	canvasSize[0] = canvas.width = window.innerWidth;
	canvasSize[1] = canvas.height = window.innerHeight;
}

function respawnAsteroids(){
	const {asteroids, asteroidLimit} = state;
	const aspectRatio = canvasSize[0] / canvasSize[1];
	
	const isFirstFrame = state.time === state.timeDelta;
	
	state.nToSpawn += state.spawnProb * Math.hypot(state.vel[0], state.vel[1]);
	
	if(state.nToSpawn > 10) state.nToSpawn = 10;
	if(asteroids.length >= asteroidLimit) return;
	
	// always spawn max
	state.nToSpawn = 1000;
	
	while(state.nToSpawn > 1 && asteroids.length < asteroidLimit){
		state.nToSpawn -= 1;
		
		const a = Math.PI * 2 * Math.random();
		
		let speed = 32 * Math.random();
		
		// meteor
		if(Math.random() < 1 / 50) speed = 256;
		
		const asteroid = {
			pos: [0, 0],
			radius: 32 * (0.5 + 0.5 * Math.random()),
			vel: [
				Math.cos(a) * speed,
				Math.sin(a) * speed,
			],
			angle: 0,
			aVel: Math.PI / 180 * 45 * ((Math.random()) * 2 - 1),
			points: [],
			//color: `hsl(${360 * Math.random()}, ${25 * Math.random()}%, ${25 + 50 * Math.random()}%)`,
			color: `hsl(${15 + 30 * (Math.random() * 2 - 1)}, ${50 + 50 * Math.random() ** 2}%, ${25 + 50 * Math.random() ** 2}%)`,
		};
		
		const vel = [
			state.vel[0] + asteroid.vel[0],
			state.vel[1] + asteroid.vel[1],
		];
		const v = Math.abs(vel[0]);
		const h = Math.abs(vel[1]) * aspectRatio;
		const vhProb = (v < h) ? (v / h / 2) : (1 - h / v / 2);
		
		if(Math.random() > vhProb){
			asteroid.pos[0] = Math.random() * canvasSize[0];
			asteroid.pos[1] = (vel[1] > 0) ? 0 : canvasSize[1];
			asteroid.pos[1] -= asteroid.radius * Math.sign(vel[1]);
		}else{
			asteroid.pos[0] = (vel[0] > 0) ? 0 : canvasSize[0];
			asteroid.pos[1] = Math.random() * canvasSize[1];
			asteroid.pos[0] -= asteroid.radius * Math.sign(vel[0]);
		}
		
		// spread into whole screen at first screen
		if(isFirstFrame){
			asteroid.pos[0] = Math.random() * canvasSize[0];
			asteroid.pos[1] = Math.random() * canvasSize[1];
		}
		
		// gen shape
		const n = Math.floor(5 + Math.random() * 7);
		const aStep = Math.PI * 2 / n;
		for(let i = 0; i < n; ++i){
			const a = aStep * (i + Math.random());
			const r = 0.7 + 0.3 * Math.random();
			asteroid.points.push([
				Math.cos(a) * r,
				Math.sin(a) * r,
			]);
		}
		asteroids.push(asteroid);
	}
}

function moveAsteroids(){
	const {asteroids, vel, timeDelta} = state;
	for(let i = 0; i < asteroids.length; ++i){
		const asteroid = asteroids[i];
		asteroid.pos[0] += (vel[0] + asteroid.vel[0]) * timeDelta;
		asteroid.pos[1] += (vel[1] + asteroid.vel[1]) * timeDelta;
		asteroid.angle += asteroid.aVel * timeDelta;
		const r = asteroid.radius;
		if(
			asteroid.pos[0] + r < 0 ||
			asteroid.pos[0] - r > canvasSize[0] ||
			asteroid.pos[1] + r < 0 ||
			asteroid.pos[1] - r > canvasSize[1]
		){
			asteroids.splice(i--, 1);
			continue;
		}
	}
}

function drawAsteroids(){
	for(const asteroid of state.asteroids){
		canvasCtx.save();
		canvasCtx.beginPath();
		// canvasCtx.arc(
		// 	asteroid.pos[0], asteroid.pos[1],
		// 	asteroid.radius,
		// 	0, Math.PI * 2,
		// );
		canvasCtx.translate(asteroid.pos[0], asteroid.pos[1]);
		canvasCtx.rotate(asteroid.angle);
		for(const p of asteroid.points){
			canvasCtx.lineTo(
				p[0] * asteroid.radius,
				p[1] * asteroid.radius,
			);
		}
		canvasCtx.fillStyle = asteroid.color;
		canvasCtx.fill();
		canvasCtx.restore();
	}
}
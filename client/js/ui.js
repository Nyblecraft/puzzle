var scoreTimer;
var score;

function start(e) {
	e.dataTransfer.effecAllowed = 'move';
	e.dataTransfer.setData("text", e.target.id);
	e.target.style.opacity = '0.4'; 
}

function end(e){
	e.target.style.opacity = '';		
	e.dataTransfer.clearData("Data");		
}

function enter(e) {
	return true;
}

function over(e) {
	return e.target.id === 'containerPieces' || e.target.className === 'containerPiece' ? false : true;
}
    
function drop(e) {
	e.preventDefault();
	const dragItem = e.dataTransfer.getData("text");
	const id = dragItem.split('piece')[1];
	const areaId = e.target.id.split('area')[1];
	if(areaId === id) {	
		document.getElementById(dragItem).removeAttribute("style");
		e.target.appendChild(document.getElementById(dragItem));
		checkOutThePuzzle();
	}
}

function dropInContainer(e) {
	e.preventDefault();
	console.log(e);
	const dragItem = e.dataTransfer.getData("text");
	const element = document.getElementById(dragItem);
	element.setAttribute("style", `top: ${e.layerY - 50}px; left: ${e.layerX - 50}px`);
	e.target.appendChild(element);
}

function checkOutThePuzzle() {
	const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	const check = arr.every((item) => {
		return document.getElementById(`piece${item}`).parentNode.id == `area${item}`;
	})
	if(check) {
		finish();
	}
}

function checkBrowser() {
	const browsers = ['msie ', 'safari', 'chrome'];
	const check = browsers.every((item) => {
		return navigator.userAgent.toLowerCase().indexOf('msie ') > -1;
	})
	if(check) {
		alert("Your browser does not support HTML5 Drag & Drop. Try a different browser.");
	} else {
		getTop10Result();
		initializeImageContainer();
	}
}

function submitUser() {
	const user = {
		id: new Date().getTime(),
		name: document.getElementById('username').value
	};
	window.localStorage.setItem('user', JSON.stringify(user));
	document.getElementById('user-form').setAttribute("style", "display: none");
	document.getElementById('puzzleContainer').setAttribute("style", "display: block");
	document.getElementById('timer').setAttribute("style", "display: block");
	startTimer();
}

function startTimer() {
	const countUpDate = new Date().getTime();

	scoreTimer = setInterval(function() {

	    let now = new Date().getTime();
	    score = now - countUpDate;
	    const timeString = getTimeString(score);

	    document.getElementById("timer").innerHTML = timeString;

	    if (score > 1000 * 60 * 60 * 24) {
	        clearInterval(scoreTimer);
	        document.getElementById("timer").innerHTML = "You have a very long time collecting the puzzle.";
	        score = 0;
	    }
	}, 1000);
}

function getTimeString(score) {
	let hours = Math.floor((score % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((score % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((score % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
}

function stopTimer() {
	clearInterval(scoreTimer);
	document.getElementById("timer").setAttribute('style', 'display: none');
	score = 0;
}

function finish() {
	let user = window.localStorage.getItem('user');
	user = JSON.parse(user);
	user.score = score;
	window.localStorage.setItem('user', JSON.stringify(user));
	stopTimer();
	document.getElementById('save-result').setAttribute('style', 'display: block');
}

function sendResult() {
	const user = window.localStorage.getItem('user');
	fetch('http://localhost:3005/scores', {
		method: 'post',
		headers: {
			"Content-type": "application/json"
		},
		body: user
	})
	.then(status)
	.then(json)
	.then((data) => {
		getTop10Result();
		alert('Successsfully saved!');
		newGame();
	})
	.catch((err) => {
		console.log(err);
		newGame();
	});
}

function getTop10Result() {
	fetch('http://localhost:3005/scores?_sort=score,name&_order=asc,asc&_page=1&_limit=10')
	.then(status)
	.then(json)
	.then((data) => {
		const top10 = data.map((item) => `<p>${item.name}: ${getTimeString(item.score)}</p>`);
		document.getElementById("top10").innerHTML = top10.join('\n');
	})
	.catch((err) => {
		console.log(err);
	});
}

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function json(response) {
  return response.json()
}

function initializeImageContainer() {
	const children = document.getElementById("containerPieces").children;
	for(let i = 0; i < children.length; i++) {
		children[i].setAttribute("style", `top: ${Math.random() * 53}px; left: ${Math.random() * 206}px`);
	}
}

function newGame() {
	window.location.reload();
}

module.exports = {
	checkBrowser: checkBrowser,
	submitUser: submitUser,
	enter: enter,
	over: over,
	drop: drop,
	start: start,
	end: end,
	dropInContainer: dropInContainer,
	sendResult: sendResult,
	newGame: newGame
}
console.log('Fire')
function clock() {
	console.log('tik tak')
	const padZero = (value) => value.toString().padStart(2, "0");
	const now = new Date();
	const hour = padZero(now.getHours());
	const minute = padZero(now.getMinutes());
	const second = padZero(now.getSeconds());
  
	const currTime = `${hour}:${minute}:${second}`;
	let txt = document.querySelector('#clock')
	txt.textContent = currTime;
}

console.log('uwu')
clock()
setInterval(clock, 1000)
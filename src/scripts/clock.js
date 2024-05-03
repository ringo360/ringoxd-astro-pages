function clock() {
	const padZero = (value) => value.toString().padStart(2, "0");
	const now = new Date();
	const hour = padZero(now.getHours());
	const minute = padZero(now.getMinutes());
	const second = padZero(now.getSeconds());
  
	const currTime = `${hour}:${minute}:${second}`;
	let txt = document.querySelector('#clock')
	txt.textContent = currTime;
}
clock()
setInterval(clock, 1000)
const btn = document.querySelector('.link-card');



const positionElement = (e)=> {
	let rect = e.target.getBoundingClientRect();
	let x = e.clientX - rect.left;
	let y = e.clientY - rect.top;
	btn.style.setProperty('--x', x + 'px');
	btn.style.setProperty('--y', y + 'px');
}

window.addEventListener('mousemove', positionElement)


const map = new Map();
(window.setScroll = () => document.body.style.setProperty('--scroll', scrollY / innerHeight))();
['scroll', 'resize'].forEach(e => addEventListener(e, setScroll));

!function setClock() {
    const date = new Date();
    const time = date.getTime();
    setRpcTimestamp(map.get('timestamp'));
    setTimeout(setClock, 1000 - time % 1000);
}();


!function lanyard() {
	console.log('Called')
    const ActivityType = ['Playing', 'Streaming to', 'Listening to', 'Watching', 'Custom status', 'Competing in'];
    const StatusColor = { online: '#4b8', idle: '#fa1', dnd: '#f44', offline: '#778' };
    const ws = new WebSocket('wss://api.lanyard.rest/socket');

    ws.addEventListener('open', () => ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: '1063527758292070591' } })));
    ws.addEventListener('error', () => ws.close());
    ws.addEventListener('close', () => setTimeout(lanyard, 1000));

    ws.addEventListener('message', async ({ data }) => {
        const { t, d } = JSON.parse(data);
        if (t !== 'INIT_STATE' && t !== 'PRESENCE_UPDATE') return;

        update('#name', d.discord_user.display_name);
        update('#dot', StatusColor[d.discord_status]);

        const activities = d.activities.filter(a => a.type !== 4);
        if (!activities.length) {
            update('#status', d.discord_status);
            update(['#large_image', '#small_image', '#activity', '#details', '#state']);
            return setRpcTimestamp();
        }

        const a = activities[0];
        ['large_image', 'small_image'].forEach(size => update(`#${size}`,
            !a.assets?.[size]
                ? ''
                : a.assets[size].startsWith('mp:')
                    ? `--image: url(https://media.discordapp.net/${a.assets[size].slice(3)}?width=${getSize(size)}&height=${getSize(size)})`
                    : a.assets[size].startsWith('spotify:')
                        ? `--image: url(https://i.scdn.co/image/${a.assets[size].slice(8)})`
                        : `--image: url(https://cdn.discordapp.com/app-assets/${a.application_id}/${a.assets[size]}.png?size=${getSize(size)})`));
        update('#status', ActivityType[a.type]);
        update('#activity', a.name);
        update('#details', a.details);
        update('#state', a.state);

        const timestamp = a.timestamps?.end ? a.timestamps.end : a.timestamps?.start;
        if (map.get('timestamp') !== timestamp) setRpcTimestamp(map.set('timestamp', timestamp).get('timestamp'));
    });

    function getSize(size) {
        return size === 'large_image' ? 96 : 40;
    }
}();

function update(selector, value = '') {
	// console.log('update')
    if (Array.isArray(selector)) return selector.forEach(s => update(s, value));
    if (map.get(selector) === value) return;
	// console.log(selector)
	// console.log(value)
    const e = document.querySelector(selector);
	// console.log(e)


    if (value.startsWith('rotate')) e.style.transform = value;
    else if (value.match(/^#[a-f0-9]+$/)) e.style.backgroundColor = value;
    else if (value.startsWith('--image')) e.style.setProperty(value.split(':')[0], value.split(' ')[1]);
    else if (value === '' && (['#large_image', '#small_image'].includes(selector))) e.removeAttribute('style');
    else e.textContent = value;

    map.set(selector, value);
}

function setRpcTimestamp(timestamp) {
	// console.log('timestamp')
    if (!timestamp) {
        update('#timestamp');
        return map.delete('timestamp');
    }
    const diff = Math.abs(timestamp - Date.now());
    const hour = Math.floor(diff / 1000 / 60 / 60);
    const minute = Math.floor(diff / 1000 / 60) % 60;
    const second = Math.floor(diff / 1000) % 60;
    const format = n => n.toString().padStart(2, '0');
    update('#timestamp', `${hour ? `${format(hour)}:` : ''}${format(minute)}:${format(second)} ${timestamp > Date.now() ? 'left' : 'elapsed'}`);
}
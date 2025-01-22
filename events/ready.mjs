
const once = true;
const name = 'ready';

async function execute(client) {
	console.log('Bot Ready');
	console.log(`Logged in as ${client.user.tag}`);
}

export { once, name, execute };
import logger from '../src/logger.mjs';

const once = false;
const name = 'messageCreate';

async function execute(message) {
    await logger(message);
}

export { once, name, execute };
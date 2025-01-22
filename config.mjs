// use require of cjs module
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// configuration
global.config = require('./config.json');

// module
global.axios = require('axios');
global.fs = require('fs');

// webhook
import { WebhookClient } from "discord.js";
global.webhookclient_logger = new WebhookClient({ url: config.log_channel_webhook });

require('dotenv').config();
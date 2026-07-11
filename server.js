const path = require('path');
require('dotenv').config();

// Clear empty keys from root .env to allow backend/.env overrides
for (const key of Object.keys(process.env)) {
  if (process.env[key] === '') {
    delete process.env[key];
  }
}

require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const { createApp } = require('./backend/src/app');
const { initializeDataServices } = require('./backend/src/config/aws');
const { env } = require('./backend/src/config/env');

const app = createApp({
  frontendRoot: __dirname,
  aiServicePath: path.join(__dirname, 'aiService.js')
});

initializeDataServices().finally(() => {
  app.listen(env.PORT, () => {
    console.log(`EV CAR WALE server running on http://localhost:${env.PORT}`);
  });
});

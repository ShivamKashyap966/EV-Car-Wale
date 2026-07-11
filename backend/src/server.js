const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();

const { createApp } = require('./app');
const { initializeDataServices } = require('./config/aws');
const { env } = require('./config/env');

const frontendRoot = path.join(__dirname, '..', '..');
const aiServicePath = path.join(frontendRoot, 'aiService.js');
const app = createApp({ frontendRoot, aiServicePath });

initializeDataServices().finally(() => {
  app.listen(env.PORT, () => {
    console.log(`Backend listening on http://localhost:${env.PORT}`);
  });
});

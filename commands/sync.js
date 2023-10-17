const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { ENV_HUB_URL } = require('../constants/globals');

const ENVHUB_DIR = path.join(os.homedir(), '.envhub');
const TOKEN_PATH = path.join(ENVHUB_DIR, 'token');
const CONFIG_PATH = 'envhub.config.json';

async function sync() {
  try {
    const token = fs.readFileSync(TOKEN_PATH, 'utf8');
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

    const envsResponse = await axios.get(`${ENV_HUB_URL}/api/cli/project/${config.id}/envs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`Founded ${envsResponse.data.length} env files`);
    for (const env of envsResponse.data) {
      const envDetails = await axios.get(`${ENV_HUB_URL}/api/cli/project/${config.id}/envs/${env.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      let envData = '';
      envData = `${env.file}`;
      const fileName = `.env.${env.type}`;
      fs.writeFileSync(fileName, envData);
      console.log(`${fileName} stored!`);
    }
    console.log('Environments synced successfully!');
  } catch (error) {
    console.error('Error syncing environments:', error.message);
  }
}

module.exports = {
  command: 'sync',
  desc: 'Sync environment variables',
  handler: sync
};

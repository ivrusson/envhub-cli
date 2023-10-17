const axios = require('axios');
const fs = require('fs');
const os = require('os');
const path = require('path');
const inquirer = require('inquirer');
const { ENV_HUB_URL } = require('../constants/globals');

const ENVHUB_DIR = path.join(os.homedir(), '.envhub');
const TOKEN_PATH = path.join(ENVHUB_DIR, 'token');

async function askForApiKey() {
  const questions = [{
    type: 'input',
    name: 'apiKey',
    message: 'Please enter your API key:',
    validate: function (value) {
      if (value.length) {
        return true;
      } else {
        return 'Please enter your API key.';
      }
    }
  }];
  return inquirer.prompt(questions);
}

async function login() {
  const { apiKey } = await askForApiKey();
  console.log('login apiKey', apiKey)
  
  try {
    const response = await axios.post(`${ENV_HUB_URL}/api/cli/login`, { apiKey });
    const token = response.data.token;

    if (!fs.existsSync(ENVHUB_DIR)) {
      fs.mkdirSync(ENVHUB_DIR);
    }

    fs.writeFileSync(TOKEN_PATH, token);
    console.log('Stored at:', TOKEN_PATH);
    console.log('Logged in successfully!');
  } catch (error) {
    console.error('Error logging in:', error.message);
  }
}

module.exports = {
  command: 'login',
  desc: 'Login to Envhub',
  handler: login
};
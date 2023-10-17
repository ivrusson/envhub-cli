const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');
const inquirer = require('inquirer');
const { ENV_HUB_URL } = require('../constants/globals');

const ENVHUB_DIR = path.join(os.homedir(), '.envhub');
const TOKEN_PATH = path.join(ENVHUB_DIR, 'token');

async function askForProjectId() {
  const questions = [{
    type: 'input',
    name: 'projectId',
    message: 'Please enter your project ID:',
    validate: function (value) {
      if (value.length) {
        return true;
      } else {
        return 'Please enter your project ID.';
      }
    }
  }];
  return inquirer.prompt(questions);
}

async function init() {
  const { projectId } = await askForProjectId();

  try {
    const token = fs.readFileSync(TOKEN_PATH, 'utf8');

    console.log(`${ENV_HUB_URL}/api/cli/project/${projectId}`);
    const response = await axios.post(`${ENV_HUB_URL}/api/cli/project/${projectId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log(`${ENV_HUB_URL}/api/cli/project/${projectId}`, response.data);
    const projectData = response.data;
    const configData = {
      id: projectData.id,
      name: projectData.name,
      description: projectData.description,
      version: projectData.version
    };

    fs.writeFileSync('envhub.config.json', JSON.stringify(configData, null, 2));
    console.log('Project initialized successfully!');
  } catch (error) {
    console.error('Error initializing project:', error.message);
  }
}

module.exports = {
  command: 'init',
  desc: 'Initialize a project',
  handler: init
};

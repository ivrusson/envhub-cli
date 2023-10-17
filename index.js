#!/usr/bin/env node

const yargs = require('yargs');
const login = require('./commands/login');
const init = require('./commands/init');
const sync = require('./commands/sync');

yargs
  .command(login)
  .command(init)
  .command(sync)
  .demandCommand()
  .help()
  .argv;

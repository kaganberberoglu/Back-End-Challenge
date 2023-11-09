const knex = require('knex')('production');
const configs = require('../knexfile.js');
const environment = process.env.NODE_ENV || 'development';

module.exports = knex(configs[environment]);

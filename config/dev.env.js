'use strict'
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DEEPFISH_BACK_BASE_URL: 'location.protocol + "//localhost:8080"',
  LINKEDIN_CLIENT_ID: '"77w79kdr6gql2h"',
});

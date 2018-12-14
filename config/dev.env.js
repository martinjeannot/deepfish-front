'use strict'
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // DEEPFISH_BACK_BASE_URL: 'location.protocol + "//localhost:8080"',
  DEEPFISH_BACK_BASE_URL: 'location.protocol + "//dev-api.deepfish.co"',
  LINKEDIN_CLIENT_ID: '"77w79kdr6gql2h"',
  REQUIREMENT_CREATION_TYPEFORM_URL: '"https://deepfish.typeform.com/to/EdFzYD?employer="',
  REQUIREMENT_CALENDLY_URL: '"https://calendly.com/deepfish/_requirement_dev"',
  TALENT_CALENDLY_URL: '"https://calendly.com/deepfish/_talent_dev"',
});

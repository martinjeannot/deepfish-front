'use strict'
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DEEPFISH_BACK_BASE_URL: 'location.protocol + "//localhost:8080"',
  // DEEPFISH_BACK_BASE_URL: 'location.protocol + "//dev-api.deepfish.co"',
  DEEPFISH_STATIC_BASE_URL: '"https://staging-deepfish-static.s3.amazonaws.com"',
  GOOGLE_MAPS_API_KEY: '"AIzaSyC5PIuf12_Hv1Kp106e7lRFDL9qEO1DbCI"',
  LINKEDIN_CLIENT_ID: '"77w79kdr6gql2h"',
  REQUIREMENT_CREATION_TYPEFORM_URL: '"https://deepfish.typeform.com/to/EdFzYD?employer="',
  REQUIREMENT_CALENDLY_URL: '"https://calendly.com/deepfish/_requirement_dev"',
  TALENT_CALENDLY_URL: '"https://calendly.com/deepfish/_talent_dev"',
});

const BoxConfig = require('config').boxAppSettings;
const JWT = require('jsonwebtoken');
const axios = require('axios');
const uuid = require('uuid')

const uri = "https://api.box.com/oauth2/token"
const jwtGrantType = "urn:ietf:params:oauth:grant-type:jwt-bearer"
const options = {
  "iss": BoxConfig.clientID,
  "sub": BoxConfig.enterpriseID,
  "box_sub_type": "enterprise",
  "aud": "https://api.box.com/oauth2/token",
  "jti": uuid.v4(), // unique string
  "exp": Math.floor(Date.now() / 1000) + 20 // create expiry for 20s in the future
}

// create jwt signature
const assertion = JWT.sign(
  options,
  { key: BoxConfig.appAuth.privateKey, passphrase: BoxConfig.appAuth.passphrase },
  { algorithm: "RS256" }
);

// format post body
const body = `grant_type=${jwtGrantType}` +
  `&client_id=${BoxConfig.clientID}` +
  `&client_secret=${BoxConfig.clientSecret}` +
  `&assertion=${assertion}`

// send request to fetch service account's enterprise access token
axios.post(uri, body)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

const BoxConfig = require('config').boxAppSettings;
const JWT = require('jsonwebtoken');
const axios = require('axios');
const uuid = require('uuid')

const clientId = "ostkg0vclqzee2j5l5ketncrctah2nn0"
const clientSecret = "psqn9Ih7I1HcbNwTsnDphKHAemw6mHSn"

const uri = "https://api.box.com/oauth2/token"
const jwtGrantType = "urn:ietf:params:oauth:grant-type:jwt-bearer"
const options = {
  "iss": clientId,
  "sub": "3924970579", // unique app user id
  "box_sub_type": "user",
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

console.log(assertion);

// format post body
const body = `grant_type=${jwtGrantType}&client_id=${clientId}&client_secret=${clientSecret}&assertion=${assertion}`

// send request to fetch user access token
axios.post(uri, body)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

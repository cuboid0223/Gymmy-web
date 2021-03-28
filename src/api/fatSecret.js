var request = require("request");
var axios = require("axios");
const clientID = "d6b41a5ea9004e249582629e5781b652";
const clientSecret = "9f951d27d7dbe41c2a6908f9a261355fc";

var options = {
  method: "POST",
  url:
    "https://blooming-stream-76058.herokuapp.com/https://oauth.fatsecret.com/connect/token",
  auth: {
    user: "d6b41a5ea9004e249582629e5781b652",
    password: "f951d27d7dbe41c2a6908f9a261355fc",
  },
  headers: {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  },
  form: {
    grant_type: "client_credentials",
    scope: "basic",
  },
  json: true,
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  const token = body.access_token;
//   console.log(token);
  window.localStorage.setItem("token", token);
  //   axios.post("http://localhost:3000/" + "calendar").then({data} => {
  //       console.log(data);
  //   });
});

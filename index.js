'use strict';

/******* HTTP SERVER USING EXPRESS *******/
// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
  app = express() //creates express http server

// Sets server port and logs message on success; server listens for requests in default port or port 1337
app.set('port', (process.env.PORT || 5000))

//Process data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Routes
app.get('/', function(req, res) {
  res.send("Hello. Let's talk food!")
})

//FACEBOOK
app.get('/webhook/', function(req, res) {
  if (req.query['hub.verify_token'] == "EAAKyI9NvUzIBABAdgFmHBVaCB4R8YvukhXO7wH51vYUs7kGsyE3vatvfoq0pctVax92R5ZA2cSVzF6RQMF4CMKhD82NZA7gRwGwm43gPpqso4b7WdWkaAo3u2wkBH11qiDufWZApv0YmVtlV2jVk8FP2cW9Pqw4KhEZB14jXxAZDZD"){
      res.send(req.query['hub.challenge'])
  }
  res.send("Wrong token")
})

app.listen(app.get('port'), function() {
  console.log("running: port")
})
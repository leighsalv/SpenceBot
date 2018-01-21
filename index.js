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
  if (req.query['hub.verify_token'] == "EAAKyI9NvUzIBAEDwOdOc2ZC4OBqgXnsZBZAUBJnTcZBKqKQX6IjWa5wRKcsmBX4buDxwDhML8OIKNATggjTFkS0ZBaVd21D0WtoZCXZB72TwfJuZAXjiGO8OzokAZB1zYZCpBZAyiul6yeJ7AGUoqZCazKsEcqZCtO77cJvWF1pBY1Tmb2AZDZD") {
      res.send(req.query['hub.challenge'])
  }
  res.send("Wrong token")
})

app.listen(app.get('port'), function() {
  console.log("running: port")
})
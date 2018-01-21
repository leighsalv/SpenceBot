'use strict';

//*****HTTP SERVER USING EXPRESS
// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
  app = express() //creates express http server

// Sets server port and logs message on success; server listens for requests in default port or port 1337
app.set('port', (process.env.PORT || 5000))

//*****Process data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//*****Routes
app.get('/', function(req, res) {
  res.send("Hello. Let's talk food!")
})

let token = "EAAKyI9NvUzIBABAdgFmHBVaCB4R8YvukhXO7wH51vYUs7kGsyE3vatvfoq0pctVax92R5ZA2cSVzF6RQMF4CMKhD82NZA7gRwGwm43gPpqso4b7WdWkaAo3u2wkBH11qiDufWZApv0YmVtlV2jVk8FP2cW9Pqw4KhEZB14jXxAZDZD"

//*****FACEBOOK
app.get('/webhook/', function(req, res) {
  if (req.query['hub.verify_token'] == "EAAKyI9NvUzIBABAdgFmHBVaCB4R8YvukhXO7wH51vYUs7kGsyE3vatvfoq0pctVax92R5ZA2cSVzF6RQMF4CMKhD82NZA7gRwGwm43gPpqso4b7WdWkaAo3u2wkBH11qiDufWZApv0YmVtlV2jVk8FP2cW9Pqw4KhEZB14jXxAZDZD"){
      res.send(req.query['hub.challenge'])
  }
  res.send("Wrong token")
})

//sends & receive messages from user
app.post('/webhook/', function(req, res) {
  let messaging_events = req.body.entry[0].messaging
  for(let i=0; i < messaging_events.length; i++) {
    let event = messaging_events[i]
    let sender = event.sender.id

    if(event.message && event.message.text) { //if there's a message & text..
      let text = event.message.text

      if(text == 'log') {
        sendText(sender, "Type in the amount like this: $10 and I will store it!")
        continue
      }
      else
      	sendText(sender, "Text echo: " + text.substring(0,100))
    }
  }
  res.sendStatus(200)
})

//sends message back to user
function sendText(sender, text){
  let messageData = {text: text}
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token : token},
    method: "POST",
    json: {
      recipient: {id: sender},
      message: messageData
    }
  }, function(error, response, body) {
    if(error) {
      console.log("sending error")
    } else if(response.body.error) {
      console.log("response body error")
    }
  })
}


/*function sendGenericMessage(sender) {
    let messageData = {
        
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}*/

//**PORT
app.listen(app.get('port'), function() {
  console.log("running: port")
})
'use strict';

// ===== HTTP SERVER USING EXPRESS ==============================================
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

let token = "EAAKyI9NvUzIBABAdgFmHBVaCB4R8YvukhXO7wH51vYUs7kGsyE3vatvfoq0pctVax92R5ZA2cSVzF6RQMF4CMKhD82NZA7gRwGwm43gPpqso4b7WdWkaAo3u2wkBH11qiDufWZApv0YmVtlV2jVk8FP2cW9Pqw4KhEZB14jXxAZDZD"

// ===== FACEBOOK ===============================================================
app.get('/webhook/', function(req, res) {
  if (req.query['hub.verify_token'] == "EAAKyI9NvUzIBABAdgFmHBVaCB4R8YvukhXO7wH51vYUs7kGsyE3vatvfoq0pctVax92R5ZA2cSVzF6RQMF4CMKhD82NZA7gRwGwm43gPpqso4b7WdWkaAo3u2wkBH11qiDufWZApv0YmVtlV2jVk8FP2cW9Pqw4KhEZB14jXxAZDZD"){
      res.send(req.query['hub.challenge'])
  }
  res.send("Wrong token")
})

//sends & receive messages from user
var spent = [];
var totalAmount = 0;

app.post('/webhook/', function(req, res) {
  let messaging_events = req.body.entry[0].messaging
  for(let i=0; i < messaging_events.length; i++) {
    let event = messaging_events[i]
    let sender = event.sender.id

    if(event.message && event.message.text) { //if there's a message & text..
      let text = event.message.text

      if(text == 'help') { //user typed help -> bot tells instructions
        sendText(sender, "Type...\nTOTAL to see how much you've spent\nCLEAR to restart log\n\nTo log money, type the amount i.e. 10 or 10.00 so I can keep track of how much you spend!")
        continue
      }

      else if(hasNumbers(text) == true){ //user typed amount $ -> bot converts string to num
      	var amount = parseFloat(text);
      	spent.push(amount);
      	sendText(sender, "$" + amount + " was logged!")
      	continue
      }

      else if(text == 'total') { //user typed total -> bot adds & replies total amount spent
      	totalAmount = 0;
      	for(var j = 0; j < spent.length; j++) {
      		totalAmount = totalAmount + spent[j];
      	}
      	sendText(sender, "You've spent: $" + totalAmount)
      	continue
      }

      else if(text == 'clear') { //user typed clear -> bot clears spent log (array)
      	spent.length = 0;
      	sendText(sender, "Log cleared")
      	continue
      }

      else
      	//"Text echo:" + text.substring(0,100) echoes back user's text
      	sendText(sender, "I'm sorry, I do not understand. Type in 'help' if you need assistance.") //default bot response

    }
  }
  res.sendStatus(200)
})

//checks if user typed numbers (verifies if it's $)
function hasNumbers(t) {
	var regex = /\d/g;
	return regex.test(t);
}

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






// ===== PORT ===============================================================
app.listen(app.get('port'), function() {
  console.log("running: port")
})
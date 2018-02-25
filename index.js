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

let token = "EAAKyI9NvUzIBAIwUJHZCyMKUnz9CeaOnWypiOXgSO9EnvFLtZAmpBRuY7w07T3XtZB0Tk3dGJeTUjVOIkQGJflwS8P8ZAHIPB9gzbUrj5VTia57SsAZB83YXfgROEkjxUiiHEdbpSXhaeqwaDDvbS66emucwyN9n6jQiwvVjpLwZDZD"

// ===== FACEBOOK ===============================================================
app.get('/webhook/', function(req, res) {
  if (req.query['hub.verify_token'] == "EAAKyI9NvUzIBAIwUJHZCyMKUnz9CeaOnWypiOXgSO9EnvFLtZAmpBRuY7w07T3XtZB0Tk3dGJeTUjVOIkQGJflwS8P8ZAHIPB9gzbUrj5VTia57SsAZB83YXfgROEkjxUiiHEdbpSXhaeqwaDDvbS66emucwyN9n6jQiwvVjpLwZDZD"){
      res.send(req.query['hub.challenge'])
  }
  res.send("Wrong token")
})



/*SENDS & RECEIVES MESSAGES FROM USER*/
var spent = []; //log
var totalAmount = 0;
var removeAmount = 0;

app.post('/webhook/', function(req, res) {
  let messaging_events = req.body.entry[0].messaging
  for(let i=0; i < messaging_events.length; i++) {
    let event = messaging_events[i]
    let sender = event.sender.id

    if(event.message && event.message.text) { //if there's a message & text..
      let text = event.message.text
      //convert everything to uppercase so we dont have to check for lower+upper cases
      text = text.toUpperCase();

      //Sends instructions to user
      if(text == "HELP") { //user typed help -> bot tells instructions
        sendText(sender, "Type...the amount i.e. 10 or 10.00 so I can keep track of how much you spend!\n\nTOTAL to see how much you've spent\nCLEAR to clear the log\nREMOVE RECENT to delete the recently typed amount")
        continue
      }

      //Inserts amount spent in the log (spent array)
      else if(hasNumbers(text) == true){ //user typed amount $ -> bot converts string to num

      	var amount = parseFloat(text);
      	spent.push(amount);
      	sendText(sender, "$" + amount + " was logged!")
      	continue
      }

      //Calculates total expenditures in the log (spent array)
      else if(text == "TOTAL") {
      	totalAmount = 0;
      	for(var j = 0; j < spent.length; j++) {
      		totalAmount = totalAmount + spent[j];
      	}
      	sendText(sender, "You've spent: $" + totalAmount)
      	continue
      }

      //Removes recently typed amount (if user made a mistake)
      else if(text == "REMOVE RECENT") {

        var r = spent.length-1;
        removeAmount = 0;

        if(spent == undefined || spent.length == 0)
        {
          sendText(sender, "You don't have any expenses in the log!")
          continue
        }

        else {
            removeAmount = spent[r];
            spent.splice(r, 1);
            sendText(sender, removeAmount + " was removed.")
            continue
        }
      }

      //Removes all amount in the log (spent array)
      else if(text == "CLEAR") {
      	spent.length = 0;
      	sendText(sender, "Log cleared")
      	continue
      }

      //Default bot response
      else
      	//"Text echo:" + text.substring(0,100) echoes back user's text
      	sendText(sender, "I'm sorry, I do not understand. Type in HELP if you need assistance.")

    }
  }
  res.sendStatus(200)
})

//checks if user typed numbers (verifies if it's $)
function hasNumbers(t) {
  /*if(t.match(/\$?\d\,?\.?/g) {
    return true;
  }
  else {
    return false;
  }

  if(text.indexOf('$')) {
    regex.replace('$','');
  }
  else if(text.indexOf(',')) {
    regex.replace(',','');
  }*/
	//var regex = /\d/g;
  var regex = /\$?\d\,?\.?/g;
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

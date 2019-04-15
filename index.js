'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()), // creates express http server
  axios = require('axios');
let now;
// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => {
 let date = new Date();
  now = ("[" + date.getHours() + " : " + date.getMinutes() + " : "
    + date.getSeconds() + "]");
    console.log('webhook is listening');
});

const acess_token = "EAAglqOdqcvIBALqeHRAFohZCpM9uIELqH4Rk6wgFrcTZCqGQHB85K1kA6OTfGYYmuhF5Dydc5EokZCjV0Spja6ZBoJL00X1IvU4rIJcVArmAB6Mdm3lPFjZCqmSW1I3ugZAjijC4pcBBNKBE1JkXnZCfnPRrQU7fKGntu8N5SjRZCwZDZD"; 
let messages = "";
// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
    let body = req.body;
  
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
      let webhook_event;
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        webhook_event = entry.messaging[0];
        let timestamp = new Date();
        messages += "[" + timestamp.getHours() + " : " + timestamp.getMinutes() + " : "
          + timestamp.getSeconds() + "] " + webhook_event.message.text + "<br>";
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
      axios.post('ttps://graph.facebook.com/v3.2/me/messages?access_token=' + acess_token,
      {
        
          "messaging_type": "RESPONSE",
          "recipient": {
            "id": webhook_event.sender.id
          },
          "message": {
            "text": "hello, world!"
          }
      },"Content-Type: application/json")
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res)
      })
      .catch((error) => {
        console.error(error)
      });

    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });

  // Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "<YOUR_VERIFY_TOKEN>"
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
  });	
  
  app.get("/", function (req, res) {
    res.send("System updated" + now + "<br>" + messages);
  });
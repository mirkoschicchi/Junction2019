var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require("body-parser");
var sms = require('./46elks_API/sms_api');
var fetch = require('node-fetch');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = 9000 || process.env.PORT;

//mongo schemas
    const eventSchema = new mongoose.Schema({
      _id:{
        device: String,
        beacon: String
      },
      timestamp: String,
      luggageId: String
    });
    const Event = mongoose.model('Event', eventSchema);

    const userSchema = new mongoose.Schema({
      _id: String
    });
    const User = mongoose.model('User', userSchema);

    const luggageSchema = new mongoose.Schema({
      _id: String,
      user: String
    });
    const Luggage = mongoose.model('Luggage', luggageSchema);

app.post('/sendsms', (req, res) => {
    sms.send_sms();
    res.send("SMS sent\n");
});



app.get('/trackBaggage', (req, res) => {
    var headers = {
        "x-api-key": "jmdSHjy6WPaXwoR75E6mJ1ImhxKPRJb51v6DBS0A"
    }

    fetch("https://junction.dev.qoco.fi/api/baggage?customerId=" + req.query.customerId, {method: 'GET', headers: headers})
    .then(baggage => baggage.json())
    .then(json => {
        fetch("https://junction.dev.qoco.fi/api/events/"+json.baggage[0].baggageId, {method: 'GET', headers: headers})
        .then(res => res.json())
        .then(returnedData => {
            console.log(returnedData.events);
            res.send(returnedData.events);
        })
    })
    .catch(error => {
        console.error(error);
    })
})

app.get('/isError', (req, res) => {
    var headers = {
        "x-api-key": "jmdSHjy6WPaXwoR75E6mJ1ImhxKPRJb51v6DBS0A"
    }

    fetch("https://junction.dev.qoco.fi/api/baggage?customerId=" + req.query.customerId, {method: 'GET', headers: headers})
    .then(baggage => baggage.json())
    .then(json => {
        fetch("https://junction.dev.qoco.fi/api/events/"+json.baggage[0].baggageId, {method: 'GET', headers: headers})
        .then(res => res.json())
        .then(returnedData => {
            console.log(returnedData.events)
            returnedData.events.forEach(transaction => {
                if(transaction.type == 'DAMAGED' || transaction.type == 'MISSING') {
                    res.send(true);
                }
            })
            res.send(false);
        })
    })
    .catch(error => {
        console.error(error);
    })
})

app.get('/data', (req, res)=>{
  Event.find(function (err, events) {
    if (err) return console.error(err);
    res.send(events);
  });
});

app.post('/update',(req,res)=>{
  console.log(req.body);
  var event1 = new Event({_id:{device: req.body.device, beacon: req.body.beacon}});
  event1.save((err, ev)=>{
    if (err) return console.error(err);
    console.log("saved");
  });
  res.send("tutt appost o' frat\n");
});

mongoose.connect('mongodb://localhost/test').then(async () => {
  app.listen(port, () => {
      console.log("Server has started on port " + port);
    });
});

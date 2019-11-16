var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var sms = require('./46elks_API/sms_api');
var fetch = require('node-fetch');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = 9000 || process.env.PORT;

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


app.listen(port, () => {
    console.log("Server has started on port " + port);
})
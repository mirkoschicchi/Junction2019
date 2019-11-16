var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var sms = require('./46elks_API/sms_api');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = 9000;

app.post('/sendsms', (req, res) => {
    sms.send_sms();
    res.send("SMS sent\n");
});

app.listen(port, () => {
    console.log("Server has started on port " + port);
})
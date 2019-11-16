const https = require('https')
const querystring = require('querystring')

const username = '<uc03aa3c7b30b9bbf71c3f5f78ed756e3>'
const password = '<57879EA7C25F85F77A7BB2EE1C165DD5>'
const postFields = {
  from:    "LuggageWatch",
  to:      "+393891029139", 
  message: "Hi,Your luggage has been received at Frankfurt airport. It is ready to be collected at Belt 6A in a few minutes. Finnair, Have a nice day!"
}

const key = new Buffer(username + ':' + password).toString('base64')
const postData = querystring.stringify(postFields)

const options = {
  hostname: 'api.46elks.com',
  path:     '/a1/SMS',
  method:   'POST',
  headers:  {
    'Authorization': 'Basic ' + key
  }
}


const callback = (response) => {
  var str = ''
  response.on('data', (chunk) => {
    str += chunk
  })

  response.on('end', () => {
    console.log(str)
  })
}

// Start the web request.
var request = https.request(options, callback)
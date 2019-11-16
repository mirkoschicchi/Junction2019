import HTTPotion.base
const https = require('https')
const querystring = require('querystring')

const username = 'API-username'
const password = 'API-password'
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

var request = https.request(options, callback)
request.write(postData)
request.end()



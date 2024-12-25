var https = require('https');

const apiKeySid = 'SK.0.EemqrPkvGQ4Ij2E3tYdI9NzIoDcJsOr';
const apiKeySecret = "REwzR0Z4NktoY2N2b3c5SHVxSGxqeUp6a2Y0NGVvdDI=";

var sms = [
   {
      "from": "842471080455",
      "to": "84377985402",
      "text": "CONTENT_SMS"
   }
]
/*
 * 'text' is string if you use brandname Stringee or your brandname
      "text": "CONTENT_SMS"

 * 'text' is array if you use brandname Notify-GSMS-VSMS:
      "text": {
               "template": 5689, 
               "params": ["param1"]
            }
*/

sendSMS(sms)


//==========================AUTHENTICATION============================//
function getAccessToken() {
   var now = Math.floor(Date.now() / 1000);
   var exp = now + 3600;

   var header = { cty: "stringee-api;v=1" };
   var payload = {
      jti: apiKeySid + "-" + now,
      iss: apiKeySid,
      exp: exp,
      rest_api: 1
   };

   var jwt = require('jsonwebtoken');
   var token = jwt.sign(payload, apiKeySecret, { algorithm: 'HS256', header: header })
   return token;
}

//==========================SEND SMS==================================//
function sendSMS(sms) {
   var options = {
      hostname: 'api.stringee.com',
      port: 443,
      path: '/v1/sms',
      method: 'POST',
      headers: {
         'X-STRINGEE-AUTH': getAccessToken(),
         'Content-Type': 'application/json',
         'Accept': 'application/json'
      }
   };

   var postData = JSON.stringify(
      {
         "sms": sms
      }
   );

   var req = https.request(options, function (res) {
      console.log('STATUS:', res.statusCode);
      console.log('HEADERS:', JSON.stringify(res.headers));
      res.setEncoding('utf8');

      res.on('data', function (chunk) {
         console.log('BODY:', chunk);
      });

      res.on('end', function () {
         console.log('No more data in response.');
      });
   });

   req.on('error', function (e) {
      console.log('Problem with request:', e.message);
   });

   req.write(postData);
   req.end();
}



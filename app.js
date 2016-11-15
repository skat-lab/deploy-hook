require('dotenv').config()

var express = require('express')
var bodyParser = require('body-parser')
var execFile = require('child_process').exec;

var app = express()

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})


app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
})

app.get('/', function(req, res) {
    res.send('Hello World!')
})

app.post('/deploy-staging', urlencodedParser, function(req, res) {

    if (req.body.token == process.env.SLACK_TOKEN) {
        // res.status(200).send('Got it ' + req.body.user_name);
        console.log(req.body);

        var arrayParams = req.body.text.split(' ');
        var branch = arrayParams[1];

        if(arrayParams[0] == "frontend" && branch) {
          execFile('./deploy.sh ' + branch, function(error, stdout, stderr) {
              if (error) {
                  console.log(error)
                  var data = {
                    "response_type": "ephemeral",
                    "text": "Sorry, that didn't work. Please try again."
                  }
                  res.json(data);
              }
              var data = {
                'response_type': 'in_channel',
                'text': 'Deployment status',
                'attachments': [
                  {
                    'text': stdout
                  }
                ]
              }
              res.json(data);
          });
        } else if (arrayParams[0] == "backend" && branch) {
            res.status(200).send('Got it to backend ' + req.body.user_name);
        } else {
          var data = {
            "response_type": "ephemeral",
            "text": "Sorry, that didn't work. Please try again."
          }
          res.json(data);
        }
    }
})

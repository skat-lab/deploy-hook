require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var execFile = require('child_process').exec;
var request = require('request');

var app = express();

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

app.post('/deploy-test', urlencodedParser, function(req, res) {

    if (req.body.token == process.env.SLACK_TOKEN) {
        console.log(req.body);

        var arrayParams = req.body.text.split(' ');
        var branch = arrayParams[1];

        if (arrayParams[0] == "frontend" && branch) {
            var data = {
                "response_type": "ephemeral",
                "text": "Started deployment process of branch " + branch
            }

            res.json(data);

            var data = {};

            execFile('./deploy-frontend.sh ' + branch + ' ' + process.env.REPO, function(error, stdout, stderr) {
                if (error) {
                    console.log(error)
                        data = {
                          "response_type": "ephemeral",
                          "text": "Sorry, that didn't work. Please try again."
                        }
                }

                // Set the headers
                var headers = {
                    'Content-Type': 'application/json'
                }

                // Configure the request
                data = {
                  'response_type': 'in_channel',
                  'text': 'Deployment of ' + branch,
                  'attachments': [
                    {
                      'text': stdout,
                      'color': '#FFFF3C'
                    },
                    {
                      'text': "Deployment complete. Check it out on http://52.169.112.190/",
                      'color': '#36a64f'
                    }
                  ]
                }

                var options = {
                    url: req.body.response_url,
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(data)
                }

                // Start the request
                request(options, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        // Print out the response body
                        console.log(body)
                    }
                })
            });

        } else if (arrayParams[0] == "backend" && branch) {
            res.status(200).send('Got it to backend ' + req.body.user_name);
            //TODO execute backend staging
        } else {
            var data = {
                "response_type": "ephemeral",
                "text": "Sorry, that didn't work. Please try again."
            }
            res.json(data);
        }
    }
})

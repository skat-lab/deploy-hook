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

app.post('/deploy-staging', urlencodedParser, function(req, res) {

    if (req.body.token == process.env.SLACK_TOKEN) {
        console.log(req.body);

        var arrayParams = req.body.text.split(' ');
        var branch = arrayParams[1];

        if (arrayParams[0] == "frontend" && branch) {
            var data = {
                "response_type": "in_channel",
                "text": "Started deployment process of branch: " + branch
            }

            res.json(data);
            execFile('./deploy.sh ' + branch, function(error, stdout, stderr) {
                if (error) {
                    console.log(error)
                        // var data = {
                        //   "response_type": "ephemeral",
                        //   "text": "Sorry, that didn't work. Please try again."
                        // }
                        // res.json(data);
                }

                // Set the headers
                var headers = {
                    'Content-Type': 'application/json'
                }

                // Configure the request
                console.log("responding to... " + req.body.response_url);
                var options = {
                    url: req.body.response_url,
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        'response_type': 'in_channel',
                        'text': 'Deployment status',
                        'attachments': [{
                            'text': stdout
                        }]
                    })
                }

                // Start the request
                request(options, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        // Print out the response body
                        console.log(body)
                    }
                })

                // var data = {
                //     'response_type': 'in_channel',
                //     'text': 'Deployment status',
                //     'attachments': [{
                //         'text': stdout
                //     }]
                // }
                // res.json(data);
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

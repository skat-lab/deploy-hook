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

        var arrayText = req.body.text.split(' ');
        var branch = arrayText[1];

        console.log(arrayText);
        execFile('./deploy.sh ' + branch, function(error, stdout, stderr) {
            if (error) {
                console.log(error)
            }
            console.log(stdout);
	           //var response = stdout;
            //res.status(200).send(response);
            var data = {
              'response_type': 'in_channel',
              'text': stdout,
            }
            res.json(data);

            //
            // var post_options = {
            //   host: req.body.response_url,
            //   port: '80',
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json'
            //   }
            // }


        });
    }
})

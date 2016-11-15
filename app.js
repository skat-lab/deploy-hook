var express = require('express')
var bodyParser = require('body-parser')
var execFile = require('child_process').exec;
var fs = require('fs');

var app = express()

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.get('/', function (req, res) {
  res.send('Hello World!')
})


app.post('/deploy', urlencodedParser, function(req,res) {

  res.status(200).send('hej ' + req.body.user_name);
  console.log(req.body);
  var indexStaging = req.body.text.indexOf('staging');
      
  if(indexStaging !== -1) {
   console.log("staging exists!");
   //var branch = req.body.text.substring(indexStaging+8);
   var arrayText = req.body.text.split(' ');

   console.log(arrayText);
   execFile('./deploy.sh', function(error, stdout, stderr) {
        if( error )
        {
            console.log(error)
        }
	console.log(stdout);
    });

   


  }
 
});
 

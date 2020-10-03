//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req,res){
  const firstName = req.body.firstName;
  const lastName = req.body.laststName;
  const email = req.body.email;

  const data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
        }
      ]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us17.api.mailchimp.com/3.0/lists/dd27ad8250-fail";
  const options = {
    method: "POST",
    auth: "larsole:4c29994d06065973a9397c7f6f6d3ee1-us17",

  }

  const request = https.request(url, options, function(response) {
    if (response.statusCode===200) {
      res.sendFile(__dirname + "/success.html");
//      res.send("Successfully subscribed");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
//      res.send("There was an error with signing up, please try again");
    }
    response.on("data", function(data){
    console.log(JSON.parse(data));
    })
  })
request.write(jsonData);
request.end();

})

app.post("/failure", function(req,res) {
  res.redirect("/");

})

app.listen(process.env.PORT || 3000, function() {       //HEROKU AND LOCALHOST

  console.log("Newsletter Server is running on port 3000.");
})

// API Key mailchimo
// 4c29994d06065973a9397c7f6f6d3ee1-us17

// List Id//
// dd27ad8250

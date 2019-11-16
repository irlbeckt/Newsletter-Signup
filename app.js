//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  //console.log(firstName, lastName, email);

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  var jsonData = JSON.stringify(data);
  var options = {
    url: "https://us5.api.mailchimp.com/3.0/lists/0731c372f7",
    method: "POST",
    headers: {
      "Authorization": "todd1 12655a20c80e5919897e7b6767ae00ea-us5"
    },
    body: jsonData
  };

  request(options, function(error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});

//References:
//Template from https://getbootstrap.com/docs/4.3/examples/sign-in/
//https://mailchimp.com/developer/guides/get-started-with-mailchimp-api-3/
//https://us5.admin.mailchimp.com/lists/members?id=231573#p:1-s:10-sa:last_update_time-so:false

//Mail Chimp API Key
//12655a20c80e5919897e7b6767ae00ea-us5

//Unique ID for audiance "Test"
//0731c372f7

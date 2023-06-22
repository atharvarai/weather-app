//jshint esversion:6
const express = require("express");

// the native way of making HTTP request using NODE.js
// We don't need to install any external packages for this, it comes in-built with node
// HTTPS is the secured version of HTTP
const https = require("https");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');


const app = express();
dotenv.config();



app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get("/",function(req,res){ //bilgi talebi
  res.sendFile(__dirname + "/index.html");
});

app.post("/",function(req,res){
  let query = req.body.cityName; // accessing the entered city name from the html form
  const apiKey = process.env.API_KEY;
  const unit = "metric";
  const lang = "en";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query +"&units=" + unit + "&lang=" + lang + "&appid=" + apiKey;

  https.get(url,function(response){ // getting response from the weather api server by providing the url. This response contains many details about the execution of the whole process
    console.log(response.statusCode); 
    
    response.on("data",function(data){ // using the 'on' method to search for some 'data' when we receive it. This 'data' will correspond to the actual message body sent to us by the weather api
      //console.log("Data:" + data); 
      const weatherData = JSON.parse(data); // parsing the 'data' into readable Js object
      const temp = weatherData.main.temp;
      const desc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      
      query = query.toUpperCase();
    
      res.render('weather',{city : query,temperature : temp,explain : desc,image : imageURL});

      res.end();
    });
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port.");
});

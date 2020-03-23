const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js

const request = require('request');

function randomImage(result) {
    var arr = [];
    
    while(arr.length != 4) {
        var randomInt = Math.floor(Math.random() * result["hits"].length);
        if(arr.indexOf(randomInt) == -1) {
            arr.push(randomInt);
        }
    }
    
    return arr;
}




//routes
app.get("/", async function(req, res){
    
    var predefinedKeyWords = ["cat", "sunset", "forest", "stars", "galaxy"];
    

    let parsedData = await getImages(predefinedKeyWords[Math.floor(Math.random() * predefinedKeyWords.length)], "Vertical");
    
    var img = randomImage(parsedData);
  
    console.dir("parsedData: " + parsedData); //displays content of the object
    // console.log(parsedData);
    
    res.render("index", {"imgs":parsedData, "img":img});
            
}); //root route





app.get("/results", async function(req, res){
    
    //console.dir(req);
    let keyword = req.query.keyword; //gets the value that the user typed in the form using the GET method
    let orien = req.query.orientation;
    
    let parsedData = await getImages(keyword, orien);
    
    var img = randomImage(parsedData);

    res.render("results", {"imgs":parsedData, "img":img});
    
});//results route





//Returns all data from the Pixabay API as JSON format
function getImages(keyword, orien){
    
    
    return new Promise( function(resolve, reject){
        request('https://pixabay.com/api/?key=5589438-47a0bca778bf23fc2e8c5bf3e&q='+keyword + "&orientation=" + orien,
                 function (error, response, body) {
    
            if (!error && response.statusCode == 200  ) { //no issues in the request
                
                 let parsedData = JSON.parse(body); //converts string to JSON
                 
                 resolve(parsedData);
                
                //let randomIndex = Math.floor(Math.random() * parsedData.hits.length);
                //res.send(`<img src='${parsedData.hits[randomIndex].largeImageURL}'>`);
                //res.render("index", {"image":parsedData.hits[randomIndex].largeImageURL});
                
            } else {
                reject(error);
                console.log(response.statusCode);
                console.log(error);
            }
    
          });//request
   
    });
    
}


//starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running...");
});
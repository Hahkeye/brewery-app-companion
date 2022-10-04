//https://www.openbrewerydb.org/documentation
//http://www.zippopotam.us/
//https://rapidapi.com/stefan.skliarov/api/AccuWeather

// DOM Selectors
const brewerySearchResults = document.querySelector('#brewery-search-results');

// Global variables
const states = {"alaska": "ak","alabama": "al","arkansas": "ar","american samoa": "as","arizona": "az","california": "ca","colorado": "co","connecticut": "ct","district of columbia": "dc","delaware": "de","florida": "fl","georgia": "ga","guam": "gu","hawaii": "hi","iowa": "ia","idaho": "id","illinois": "il","indiana": "in","kansas": "ks","kentucky": "ky","louisiana": "la","massachusetts": "ma","maryland": "md","maine": "me","michigan": "mi","minnesota": "mn","missouri": "mo","mississippi": "ms","montana": "mt","north carolina": "nc","north dakota": "nd","nebraska": "ne","new hampshire": "nh","new jersey": "nj","new mexico": "nm","nevada": "nv","new york": "ny","ohio": "oh","oklahoma": "ok","oregon": "or","pennsylvania": "pa","puerto rico": "pr","rhode island": "ri","south carolina": "sc","south dakota": "sd","tennessee": "tn","texas": "tx","utah": "ut","virginia": "va","virgin islands": "vi","vermont": "vt","washington": "wa","wisconsin": "wi","west virginia": "wv","wyoming": "wy"};
var coords = 0;
var brewerys=[];
var games=[];

class Brewery{
    constructor(blob){
        this.name = blob.name;
        this.phone = blob.phone;
        this.url = blob.website_url;
        this.city = blob.city;
        this.address = (blob.street + " " + blob.city + " " + blob.state + " " + blob.postal_code);
    }
    toHtml(){
        let tempCard = $('<div>');
        tempCard.attr('class','card');
        let tempBody = $('<div>');
        tempBody.attr('class','card-body');
        tempBody.append($('<h3>').text("Name: "+this.name));
        tempBody.append($('<p>').text("City: "+this.city));
        tempBody.append($('<p>').text("Phone Number: "+this.phone));
        tempBody.append($('<p>').text("Address: "+this.address));
        tempBody.append($('<p>').text("Website: "+this.url));
        tempCard.on("click",function(){
            console.log("memes")
            window.location.href="./page3.html?games=yes";
        });
        return tempCard.append(tempBody);
    }
}

class Game{
    constructor(blob){ //Constructor of game class. 
        this.name=blob.name;
        this.howtTo=blob.howtTo;
        this.img=blob.img;
    }
    toHtml(){ //Takes a game obejct and returns html to display it.
        let tempCard = $('<div>').attr("class","cardflip");
        let tempInner = $('<div>').attr("class","innercardflip");
        let tempFront = $('<div>').attr("class","cardflip-front");
        tempFront.append($('<h1>').text(this.name));
        tempFront.append($('<img>').attr("src",`http://mineboss.asuscomm.com:56733/images/?name=${this.img}`).attr("alt",`Picture of ${this.img.split("."[0])}`).attr("width","200px").attr("height","200px"));
        let tempBack = $('<div>').attr("class","cardflip-back");
        tempBack.append($('<h3>').text("Watch this to learn how to play!"));
        tempBack.append($('<iframe>').attr("id","ytplayer").attr("type","text/html").attr("width","200px").attr("height","125px").attr("src",`${this.howtTo}`));
        tempInner.append(tempFront);
        tempInner.append(tempBack)
        tempCard.append(tempInner);
        tempCard.on('click',function(){//listener on the card for the flip.
            $(this).toggleClass('hover');
        });
        return tempCard;
    }
}

// If the browser doesn't support geolocation block the button from being shown.
let tempLocation = JSON.parse(localStorage.getItem("location-id"));
let tempForecast = JSON.parse(localStorage.getItem("forecast"));
//If the browser doesnt support geolocation block the button from being shown.
$(function(){
    if(!navigator.geolocation){
        $('#getGeo').css('display','none');
    }
});

// Logging geolocation information
function showLocation (position) {
    coords = position.coords;
    window.location.href = `./page2.html?latlon=${position.coords.latitude},${position.coords.longitude}`;

}

// If user blocks geolocation, prompt them to input city and state
function promptLocationInput () {
    alert("Please enter a city and state.");
}
   
// If geolocation is accepted, translate lat/long into zip code
async function getZipFromLatLong (){
    try{
        const response = await fetch(`http://api.geonames.org/findNearbyPostalCodesJSON?lat=${coords.latitude}&lng=${coords.longitude}&maxRows=1&style=SHORT&username=hahkeye`);
        const data = await response.json();
        console.log(data.postalCodes[0].postalCode);
        // return data.postalCodes[0].postalCode;
    }catch(e){
        console.log("Error in fetching zipcodes ", e);
    }
}

async function getBreweriesByCoordCode(zipCode,numberOfBreweries=5){
    try{
        const response = await fetch(`https://api.openbrewerydb.org/breweries?by_dist=${zipCode[0]},${zipCode[1]}&per_page=${numberOfBreweries}`);
        const data = await response.json();
        for(let b of data){
            let tempB = new Brewery(b);
            brewerys.push(tempB);
        }
        populateBrews()
        
    }catch(e){
        console.log("Error in fetching breweries ", e);
    }    
    // console.log(data);     // Is this the correct location to call this function?
}
async function validCity(state){
    let city=$('#city').val().toLowerCase();
    
    try{
        const response = await fetch(`https://api.zippopotam.us/US/${state}/${city}`)
        if(response.status=="404"){
            alert("Please enter a valid city.");
        }else{
            const data = await response.json();
            console.log(data.places[0].latitude);
            console.log(data.places[0].longitude);
            console.log("2,"+data.places[0]["post code"]);
            console.log(tempForecast);
            window.location.href = `./page2.html?latlon=${data.places[0].latitude},${data.places[0].longitude}`;

        }
    }catch(e){
        console.log("Failed to get postal code. ",e);
    }
}

function validState(){
    let state=$('#state').val().toLowerCase();
    if(states[state]){
        // console.log("1,"+states[state]);
        validCity(states[state]);

    }else{
        alert("Please enter a valid state.");
    }
}


// Get weather by zipcode
async function getWeatherByZipCode(zipCode){

    let key = 0;
    
    // First fetch to capture zipcode "Key"
    try{    
        const response = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=%09cDt63DqtaKBplCaTQdLTUsKRTCQZaAYi&q=45.5%2C-94.1`);
        const data = await response.json();
        // console.log(data);
        key = data.Key;
        // console.log(key); 
    }catch(e){
        console.log("Error in fetching zipcode key ", e);
    }
    
    // Second fetch to capture area forecast based on key
    try{
        const response = await fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${key}?apikey=%09cDt63DqtaKBplCaTQdLTUsKRTCQZaAYi`);
        const data = await response.json();
        return data;
    }catch(e){
        console.log("Error in fetching the weather ", e);
    }    
}

async function tempWeatherStorage(){
    
    if (!localStorage.getItem("forecast")){

        try{
            const response = await fetch (`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=%09cDt63DqtaKBplCaTQdLTUsKRTCQZaAYi&q=45.5%2C-94.1`);
            const data = await response.json();
            // console.log(data);
            localStorage.setItem("location-id", JSON.stringify(data));
            key = data.Key;
            // console.log(key);
        }catch(e){
            console.log("Error in storing location information ", e);
        }      
        
        try{
            const response = await fetch (`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${key}?apikey=%09cDt63DqtaKBplCaTQdLTUsKRTCQZaAYi`);
            const data = await response.json();
            // console.log(data);
            localStorage.setItem("forecast", JSON.stringify(data));
        }catch(e){
            console.log("Error in storing forecast information ", e);
        }
    }
}

async function populateGames(){//grabs game list from api objectifys them.
    let tempTarget = $('.games-lists');
    try{
        const response = await fetch(`http://mineboss.asuscomm.com:56733/games`);
        const data = await response.json();
        // console.log(data);
        for(let i of data){
            let x =new Game(i);
            // console.log(x.toHtml());
            tempTarget.append(x.toHtml());
        }
        // return new Brewery(data);
    }catch(e){
        console.log("Error in fetching breweries ", e);
    }    
}

function populateBrews(){
    let tempTarget = $('#brewery-search-results');
    for(let b in brewerys){
        tempTarget.append(brewerys[b].toHtml());
    }
}

$('#health-facts').on('click',function(event){
    if($(event.target).attr("class")== "fold"){
        if($(event.target).next('div').css("display")  == "block"){
            $(event.target).next('div').css("display","none");
        }else{
            $(event.target).next('div').css("display","block");
        }
    }
  });
  

//Listeners

// Geolocation listener
$('#getGeo').on('click',function(){
    navigator.geolocation.getCurrentPosition(showLocation, promptLocationInput);
});

$(function(){
    // console.log(window.location.search);
    let urlP = new URLSearchParams(window.location.search);
    if(urlP.get("latlon")){
        let urlP = new URLSearchParams(window.location.search);
        // console.log(urlP.get("latlon"));
        getBreweriesByCoordCode([urlP.get("latlon").split(',')[0],urlP.get("latlon").split(',')[1]]);
    }
    if(urlP.get("games")){
        populateGames();
    }

});

$(document).ready(function() {  

    $('.cardflip').click(function() {
        $(this).toggleClass('hover');
    });
  
  });

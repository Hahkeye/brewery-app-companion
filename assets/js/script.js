//https://www.openbrewerydb.org/documentation
//http://www.zippopotam.us/
//https://rapidapi.com/stefan.skliarov/api/AccuWeather

// DOM Selectors
const brewerySearchResults = document.querySelector('#brewery-search-results');

// Global variables
const states = {"alaska": "ak","alabama": "al","arkansas": "ar","american samoa": "as","arizona": "az","california": "ca","colorado": "co","connecticut": "ct","district of columbia": "dc","delaware": "de","florida": "fl","georgia": "ga","guam": "gu","hawaii": "hi","iowa": "ia","idaho": "id","illinois": "il","indiana": "in","kansas": "ks","kentucky": "ky","louisiana": "la","massachusetts": "ma","maryland": "md","maine": "me","michigan": "mi","minnesota": "mn","missouri": "mo","mississippi": "ms","montana": "mt","north carolina": "nc","north dakota": "nd","nebraska": "ne","new hampshire": "nh","new jersey": "nj","new mexico": "nm","nevada": "nv","new york": "ny","ohio": "oh","oklahoma": "ok","oregon": "or","pennsylvania": "pa","puerto rico": "pr","rhode island": "ri","south carolina": "sc","south dakota": "sd","tennessee": "tn","texas": "tx","utah": "ut","virginia": "va","virgin islands": "vi","vermont": "vt","washington": "wa","wisconsin": "wi","west virginia": "wv","wyoming": "wy"};
let coords = 0;
let breweryTest;
class Brewery{
    constructor(blob){
        this.name = blob.name;
        this.phone = blob.phone;
        this.url = blob.website_url;
        this.city = blob.city;
        this.address = (blob.street + " " + blob.city + " " + blob.state + " " + blob.postal_code);
    }
    getName() {
        return this.name;
    }
}

/*
0: 
address_2: null
address_3: null
brewery_type: "micro"
city: "Saint Cloud"
country: "United States"
county_province: null
created_at: "2022-08-20T02:56:08.975Z"
id: "beaver-island-brewing-company-saint-cloud"
latitude: "45.5585455"
longitude: "-94.15733312"
name: "Beaver Island Brewing Company"
phone: "3202535907"
postal_code: "56301-4304"
state: "Minnesota"
street: "216 6th Ave S"
updated_at: "2022-08-20T02:56:08.975Z"
website_url: "http://www.beaverislandbrew.com"
*/

// If the browser doesn't support geolocation block the button from being shown.
$(function(){
    if(!navigator.geolocation){
        $('#getGeo').css('display','none');
    }
});

// Logging geolocation information
function showLocation (position) {
    coords = position.coords;
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
        return data;
    }catch(e){
        console.log("Error in fetching zipcodes ", e);
    }
}

async function getBreweriesByZipCode(zipCode,numberOfBreweries=1){
    try{
        const response = await fetch(`https://api.openbrewerydb.org/breweries?by_postal=${zipCode}&per_page=${numberOfBreweries}`);
        const data = await response.json();
        return new Brewery(data);
    }catch(e){
        console.log("Error in fetching breweries ", e);
    }    
    // console.log(data);
    displayBreweries(data);     // Is this the correct location to call this function?
}

function test(data) {
    let brewery = new Brewery(data[0]);
    console.log(brewery);
}

async function postalCodeTest(){
    //state,city
    let state=$('#state').val();
    let city=$('#city').val();
    try{
        const response = await fetch(`https://api.zippopotam.us/US/${state}/${city}`)
        if(response.status=="404"){
            alert("Please enter a valid city and state");
        }else{
            const data = await response.json();
            console.log(data);
        }
    }catch(e){
        console.log("Failed to get postal code. ",e);
    }
}

// Get weather by zipcode
async function getWeatherByZipCode(zipCode){

    let key = 0;
    
    // First fetch to capture zipcode "Key"
    try{    
        const response = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=%09cDt63DqtaKBplCaTQdLTUsKRTCQZaAYi&q=45.5%2C-94.1`);
        const data = await response.json();
        console.log(data);
        key = data.Key;
        console.log(key); 
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

let tempLocation = JSON.parse(localStorage.getItem("location-id"));
let tempForecast = JSON.parse(localStorage.getItem("forecast"));

async function tempWeatherStorage(){
    
    if (!localStorage.getItem("forecast")){

        try{
            const response = await fetch (`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=%09cDt63DqtaKBplCaTQdLTUsKRTCQZaAYi&q=45.5%2C-94.1`);
            const data = await response.json();
            console.log(data);
            localStorage.setItem("location-id", JSON.stringify(data));
            key = data.Key;
            console.log(key);
        }catch(e){
            console.log("Error in storing location information ", e);
        }      
        
        try{
            const response = await fetch (`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${key}?apikey=%09cDt63DqtaKBplCaTQdLTUsKRTCQZaAYi`);
            const data = await response.json();
            console.log(data);
            localStorage.setItem("forecast", JSON.stringify(data));
        }catch(e){
            console.log("Error in storing forecast information ", e);
        }
    }
}

function displayBreweries(data){
    console.log(data);
    
    // set up `<div>` to hold result content (this is the parent `<div>`)
    let resultCard = document.createElement('div');
    resultCard.classList.add('card', /* add CSS styling classes */);

    // create body `<div>` and append to resultCard
    let resultBody = document.createElement('div');
    resultBody.classList.add('card-body', /* add CSS styling classes */);
    resultCard.append(resultBody);

    // create brewery name `<h3>`
    let breweryNameEl = document.createElement('h3');
    // breweryNameEl.classList.add('h3', /* add CSS styling classes */);
    breweryNameEl.textContent = "Name: " + data.name;

    // create city `<p>`
    let breweryCityEl = document.createElement('p');
    // breweryCityEl.classList.add('p', /* add CSS styling classes */);
    breweryCityEl.textContent = "City: " + data.city;

    // create phone number `<p>`
    let breweryPhoneEl = document.createElement('p');
    // breweryPhoneEl.classList.add('p', /* add CSS styling classes */);
    breweryPhoneEl.textContent = "Phone number: " + data.phone;

    // create address `<p>`
    let breweryAddressEl = document.createElement('p');
    // breweryAddressEl.classList.add('p', /* add CSS styling classes */);
    breweryAddressEl.textContent = "Address: " + data.street + " " + data.city + " " + data.state + " " + data.postal;

    // create url `<p>`
    let breweryWebsiteEl = document.createElement('p');
    // breweryWebsiteEl.classList.add('p', /* add CSS styling classes */);
    breweryWebsiteEl.textContent = "Website: " + data.website_url;

    // append brewery information to resultBody
    resultBody.append(breweryNameEl, breweryCityEl, breweryPhoneEl, breweryAddressEl, breweryWebsiteEl);

    // apend entire contents of resultCard to brewerySearchResults `<div>` in page2.html
    brewerySearchResults.append(resultCard);
}

//Listeners

// Geolocation listener
$('#getGeo').on('click',function(){
    navigator.geolocation.getCurrentPosition(showLocation, promptLocationInput);
    // getLocation();
});

// Search button listener
// When the user clicks the search button, what needs to happen?
    // User is redirected to second page
    // getBreweriesByZip function is initiated
    // displayBreweries is called after page redirect
$('#search-button').on('click', getBreweriesByZipCode);

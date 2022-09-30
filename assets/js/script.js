//https://www.openbrewerydb.org/documentation
//http://www.zippopotam.us/
//https://rapidapi.com/stefan.skliarov/api/AccuWeather


// Global variable
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


// On page load ask for location, if not prompt input
window.onload = function() {
    getLocation()
};

// Logging geolocation information
function showLocation (position) {
    console.log(position.coords.latitude)
    console.log(position.coords.longitude)

    coords = position.coords;
}

// Retrieving geolocation information
function getLocation() {//location grabbing function change latter
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showLocation, promptLocationInput);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

// If user blocks geolocation, prompt them to input city and state
function promptLocationInput () {
    prompt("Please enter a city and state.");
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

/*
function getZipFromLatLong() {

    // http://api.geonames.org/findNearbyPostalCodesJSON?lat=45.5&lng=-94.1&username=hahkeye
    // http://api.geonames.org/findNearbyPostalCodes?lat=${coords.latitude}&lng=${coords.longitude}&maxRows=1&style=SHORT&username=hahkeye

  fetch (`http://api.geonames.org/findNearbyPostalCodesJSON?lat=${coords.latitude}&lng=${coords.longitude}&maxRows=1&style=SHORT&username=hahkeye`)  
    .then(response =>{
        return response.json();
    }).then(data=>{
        console.log(data);
    }).catch(function(error){
        console.log("", error);
    });
}   
*/

async function getBreweriesByZipCode(zipCode,numberOfBrewerys=1){
    try{
        const response = await fetch(`https://api.openbrewerydb.org/breweries?by_postal=${zipCode}&per_page=${numberOfBrewerys}`);
        const data = await response.json();
        return new Brewery(data);
    }catch(e){
        console.log("Error in fetching breweries ", e);
    }    
    // console.log(data);
}

/*
function getBreweryByZipCode(zipCode){//handle multiple pages
    // third act craft brewery
    // https://api.openbrewerydb.org/breweries?by_name=cooper&per_page=3
    // https://api.openbrewerydb.org/breweries?by_postal=55129&per_page=3

     fetch(`https://api.openbrewerydb.org/breweries?by_postal=${zipCode}&per_page=3`).then(response =>{
         return response.json();
     }).then(data=>{
         console.log(data);
         test(data);        
     }).catch(function(error){
         console.log("Error in the api request 2", error);
     });
}
*/

function test(data) {
    let brewery = new Brewery(data[0]);
    console.log(brewery);
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

/*
function getWeatherByZipCode(zipCode){
    // http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=%09cDt63DqtaKBplCaTQdLTUsKRTCQZaAYi&q=45.5%2C-94.1

    // http://dataservice.accuweather.com/forecasts/v1/daily/1day/948?apikey=%09cDt63DqtaKBplCaTQdLTUsKRTCQZaAYi

    // kayla api key cDt63DqtaKBplCaTQdLTUsKRTCQZaAYi

    let key = 0;

    fetch(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=%09cDt63DqtaKBplCaTQdLTUsKRTCQZaAYi&q=45.5%2C-94.1`).then(response =>{
        return response.json();
    }).then(data =>{
        console.log(data);
        key = data.Key;
        console.log(key);
        
        fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${key}?apikey=%09cDt63DqtaKBplCaTQdLTUsKRTCQZaAYi`).then(response =>{
            return response.json();
        }).then(data =>{
            console.log(data);
        }).catch(function(error){
            console.log("", error);
        })          
        
    }).catch(function(error){
        console.log("", error);
    })

}
*/

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

/*
function tempWeatherStorage() {
    
    if (!localStorage.getItem("forecast")){
        
        fetch(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=%09cDt63DqtaKBplCaTQdLTUsKRTCQZaAYi&q=45.5%2C-94.1`).then(response =>{
            return response.json();
        }).then(data =>{
            console.log(data);
            localStorage.setItem("location-id", JSON.stringify(data));
            key = data.Key;
            console.log(key);
            
        fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${key}?apikey=%09cDt63DqtaKBplCaTQdLTUsKRTCQZaAYi`).then(response =>{
                return response.json();
            }).then(data =>{
                console.log(data);
                localStorage.setItem("forecast", JSON.stringify(data));
            }).catch(function(error){
                console.log("", error);
            })          
            
            }).catch(function(error){
                console.log("", error);
        })
    }      
}
*/


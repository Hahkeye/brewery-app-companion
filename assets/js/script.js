//https://www.openbrewerydb.org/documentation
//http://www.zippopotam.us/
//https://rapidapi.com/stefan.skliarov/api/AccuWeather


// Global variable
let coords = 0;


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

// If geolocation is accepted, need  to translate lat/long into zip code
function getZipFromLatLong () {
    // http://api.geonames.org/findNearbyPostalCodesJSON?lat=45.5&lng=-94.1&username=hahkeye
    // http://api.geonames.org/findNearbyPostalCodes?lat=${coords.latitude}&lng=${coords.longitude}&maxRows=1&style=SHORT&username=hahkeye

    fetch (`http://api.geonames.org/findNearbyPostalCodesJSON?lat=${coords.latitude}&lng=${coords.longitude}&maxRows=1&style=SHORT&username=hahkeye`).then(response =>{
        return response.json();
    }).then(data=>{
        console.log(data);
    }).catch(function(error){
        console.log("", error);
    });
}

// Get breweries by zipcode
function getBreweryByZipCode(zipCode){//handle multiple pages
    //third act craft brewery
    //https://api.openbrewerydb.org/breweries?by_name=cooper&per_page=3
    //https://api.openbrewerydb.org/breweries?by_postal=55129&per_page=3

    fetch(`https://api.openbrewerydb.org/breweries?by_postal=${zipCode}&per_page=3`).then(response =>{
        return response.json();
    }).then(data=>{
        console.log(data);
    }).catch(function(error){
        console.log("Errorr in the api request 2", error);
    });
}

// Get weather by zipcode
// http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=%09cDt63DqtaKBplCaTQdLTUsKRTCQZaAYi&q=45.5%2C-94.1

// http://dataservice.accuweather.com/forecasts/v1/daily/1day/948?apikey=%09cDt63DqtaKBplCaTQdLTUsKRTCQZaAYi

// kayla api key cDt63DqtaKBplCaTQdLTUsKRTCQZaAYi

function getWeatherByZipCode(zipCode){

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

   




    // const encodedParams = new URLSearchParams();
    // encodedParams.append("apiKey", "<REQUIRED>");
    // encodedParams.append("query", "zipCode");

    // const options = {
    //     method: 'POST',
    //     headers: {
    //         'content-type': 'application/x-www-form-urlencoded',
    //         'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
    //         'X-RapidAPI-Host': 'AccuWeatherstefan-skliarovV1.p.rapidapi.com'
    //     },
    //     body: encodedParams
    // };

    // fetch('https://accuweatherstefan-skliarovv1.p.rapidapi.com/searchPostalCode', options)
    //     .then(response => response.json())
    //     .then(response => console.log(response))
    //     .catch(err => console.error(err));

}

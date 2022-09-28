//https://www.openbrewerydb.org/documentation
//http://www.zippopotam.us/
//https://rapidapi.com/stefan.skliarov/api/AccuWeather

// on page load ask for location if not then enter in the boxs


function getLocation() {//location grabbing function change latter

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function getBreweryByZipCode(zipCode){//handle multiple pages
    //third act craft brewery
    //https://api.openbrewerydb.org/breweries?by_name=cooper&per_page=3
    //https://api.openbrewerydb.org/breweries?by_postal=55129&per_page=3
    fetch(`https://api.openbrewerydb.org/breweries?by_postal=${zipCode}&per_page=3`).then(response =>{
        return response.json();
    }).then(data=>{
        console.log(data);
    }).catch(function(error){
        console.log("Erorr in the api request 2",error);
    });
}

function getWeatherByZipCode(zipCode){
    const encodedParams = new URLSearchParams();
    encodedParams.append("apiKey", "<REQUIRED>");
    encodedParams.append("query", "zipCode");

    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
            'X-RapidAPI-Host': 'AccuWeatherstefan-skliarovV1.p.rapidapi.com'
        },
        body: encodedParams
    };

    fetch('https://accuweatherstefan-skliarovv1.p.rapidapi.com/searchPostalCode', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

}


//location function --> get coordinates 
function getCoordinates() {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
  
    function success(pos) {
        var crd = pos.coords;
        var lat = crd.latitude.toString();
        var lng = crd.longitude.toString();
        var coordinates = [lat, lng];
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        getCity(coordinates);
        console.log("City" + getCity(coordinates));
        return;
  
    }
  
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
  
    navigator.geolocation.getCurrentPosition(success, error, options);
}

// get city
function getCity(coordinates) {
    var xhr = new XMLHttpRequest();
    var lat = coordinates[0];
    var lng = coordinates[1];
    // var city_request = "";
    // Paste your LocationIQ token below.
    xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.84900f437a1afaa4e93f8961f05cce39&lat=" +
    lat + "&lon=" + lng + "&format=json", true);
    xhr.send();
    xhr.onreadystatechange = processRequest;
    xhr.addEventListener("readystatechange", processRequest, false);
  
    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            var city = response.address.city;
            // city_request = city.toString();
            console.log(city);
            return city.toString();
        }
    }
    // return processRequest(city);
}

// console.log(getCoordinates());

// get temperature
    // high/low and current
    // hourly and 7-day forecast
function getTemperature() {
    // Enter your API key here
    const api_key = '4fc8b020e0e454b126b87d4078185ae5';

    // base_url variable to store url
    const base_url = 'http://api.openweathermap.org/data/2.5/weather?';

    // Give city name
    const coords = getCoordinates();
    console.log("Coords: " + coords);
    const city_name = getCity(coords);

    // complete_url variable to store complete url address
    const complete_url = `${base_url}appid=${api_key}&q=${city_name}`;

    // Make a GET request to the API using fetch
    fetch(complete_url)
    .then(function (response) {
        if (response.ok) {
        return response.json();
        } else {
        throw new Error('City Not Found');
        }
    })
    .then(function (data) {
        const y = data.main;
        const current_temperature = y.temp;
        const current_pressure = y.pressure;
        const current_humidity = y.humidity;
        const z = data.weather;
        const weather_description = z[0].description;

        // Print the weather information
        console.log(
        ' Temperature (in kelvin unit) = ' +
            current_temperature +
            '\n atmospheric pressure (in hPa unit) = ' +
            current_pressure +
            '\n humidity (in percentage) = ' +
            current_humidity +
            '\n description = ' +
            weather_description
        );
    })
    .catch(function (error) {
        console.log('Error:', error.message);
    });
}

console.log(getTemperature());
    
// converter function (F --> C)
// get weather condition
// add city
// get precipitation map
// air quality index
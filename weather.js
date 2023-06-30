var currentCity;
var currentLat;
var currentLon;
var currentTemp;
var currentFeel;
var currentMaxTemp;
var currentMinTemp;

//Retrieves latitude and longitude coordinates of user's current location
function getCoordinates() {
    return new Promise((resolve, reject) => {
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
        resolve(coordinates); // Resolve the promise with the coordinates
      }
  
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        reject(err); // Reject the promise with the error
      }
  
      navigator.geolocation.getCurrentPosition(success, error, options);
    });
  }
  
  // Retrieves city name of user's current location using getCoordinates()
  function getCity(coordinates) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      var lat = coordinates[0];
      var lng = coordinates[1];
  
      xhr.open(
        "GET",
        `https://us1.locationiq.com/v1/reverse.php?key=pk.84900f437a1afaa4e93f8961f05cce39&lat=${lat}&lon=${lng}&format=json`,
        true
      );
      xhr.send();
  
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var response = JSON.parse(xhr.responseText);
          var city = response.address.city;
          currentCity = city;
          currentLat = lat;
          currentLon = lng;
          resolve(city); // Resolve the promise with the city
        }
      };
    });
  }
  
  // Retrieves current temperature, real feel temperature, high and low temperatures, pressure, humidity, and weather description
  // Based on user's current location
  function getTemperature() {
    const api_key = "4fc8b020e0e454b126b87d4078185ae5";
    const base_url = "https://api.openweathermap.org/data/2.5/weather?";
  
    getCoordinates()
      .then((coordinates) => getCity(coordinates))
      .then((city_name) => {
        const complete_url = `${base_url}appid=${api_key}&q=${city_name}`;
        return fetch(complete_url);
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("City Not Found");
        }
      })
      .then((data) => {
        var y = data.main;
        currentTemp = Math.round((y.temp - 273.15) * 9/5 + 32);
        currentFeel = Math.round((y.feels_like - 273.15) * 9/5 + 32);
        currentMaxTemp = Math.round((y.temp_max - 273.15) * 9/5 + 32);
        currentMinTemp = Math.round((y.temp_min - 273.15) * 9/5 + 32);
        const current_pressure = (y.pressure * 0.02952998057228486).toFixed(2);
        const current_humidity = y.humidity;
        const z = data.weather;
        const weather_description = z[0].description;
  
        currentLat = (currentLat * 1).toFixed(2);
        currentLon = (currentLon * 1).toFixed(2);
        document.getElementById("City").innerHTML = currentCity;
        document.getElementById("Temperature").innerHTML = currentTemp + "&deg; F";
        document.getElementById("feelsLike").innerHTML = "Feels Like: " + currentFeel + "&deg; F";
        document.getElementById("maxTemp").innerHTML = "High: " + currentMaxTemp + "&deg; F";
        document.getElementById("minTemp").innerHTML = "Low: " + currentMinTemp + "&deg; F";
        document.getElementById("Pressure").innerHTML = "Pressure: " + current_pressure + " Hg";
        document.getElementById("Humidity").innerHTML = "Humidity: " + current_humidity + "%";
        document.getElementById("weatherDescription").innerHTML = "Current Weather Description: " + weather_description;
      })
      .catch((error) => {
        console.warn("Error:", error.message);
      });
  }

  //Loads weather information from getTemperature()
  function initializePage() {
    getTemperature();
  }

  //Converts temperatures between Celsius and Fahrenheit
  function unitConverter() {
    var converter = document.getElementById("Converter");
    var curTemp = document.getElementById("Temperature");
    var curFeel = document.getElementById("feelsLike");
    var curMax = document.getElementById("maxTemp");
    var curMin = document.getElementById("minTemp");
    if (converter.innerHTML === "Convert to Fahrenheit") {
      converter.innerHTML = "Convert to Celsius";
      curTemp.innerHTML = Math.round(((currentTemp) * 9/5) + 32) + "&deg; F";
      currentTemp = Math.round(((currentTemp) * 9/5) + 32);
      curFeel.innerHTML = "Feels Like: " + Math.round(((currentFeel) * 9/5) + 32) + "&deg; F";
      currentFeel = Math.round(((currentFeel) * 9/5) + 32);
      curMax.innerHTML = "High: " + Math.round(((currentMaxTemp) * 9/5) + 32) + "&deg; F";
      currentMaxTemp = Math.round(((currentMaxTemp) * 9/5) + 32);
      curMin.innerHTML = "Low: " + Math.round(((currentMinTemp) * 9/5) + 32) + "&deg; F";
      currentMinTemp = Math.round(((currentMinTemp) * 9/5) + 32);
    } else if (converter.innerHTML === "Convert to Celsius") {
      converter.innerHTML = "Convert to Fahrenheit";
      curTemp.innerHTML = Math.round(((currentTemp) - 32) * 5/9) + "&deg; C";
      currentTemp = Math.round(((currentTemp) - 32) * 5/9);
      curFeel.innerHTML = "Feels Like: " + Math.round(((currentFeel) - 32) * 5/9) + "&deg; C";
      currentFeel = Math.round(((currentFeel) - 32) * 5/9);
      curMax.innerHTML = "High: " + Math.round(((currentMaxTemp) - 32) * 5/9) + "&deg; C";
      currentMaxTemp = Math.round(((currentMaxTemp) - 32) * 5/9);
      curMin.innerHTML = "Low: " + Math.round(((currentMinTemp) - 32) * 5/9) + "&deg; C";
      currentMinTemp = Math.round(((currentMinTemp) - 32) * 5/9);
    }
  }
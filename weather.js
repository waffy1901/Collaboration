//location function --> get coordinates 
// Location function: Get coordinates
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
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        resolve(coordinates); // Resolve the promise with the coordinates
      }
  
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        reject(err); // Reject the promise with the error
      }
  
      navigator.geolocation.getCurrentPosition(success, error, options);
    });
  }
  
  // Get city
  function getCity(coordinates) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      var lat = coordinates[0];
      var lng = coordinates[1];
  
      xhr.open(
        'GET',
        `https://us1.locationiq.com/v1/reverse.php?key=pk.84900f437a1afaa4e93f8961f05cce39&lat=${lat}&lon=${lng}&format=json`,
        true
      );
      xhr.send();
  
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var response = JSON.parse(xhr.responseText);
          var city = response.address.city;
          console.log(city);
          resolve(city); // Resolve the promise with the city
        }
      };
    });
  }
  
  // Get temperature
  function getTemperature() {
    const api_key = '4fc8b020e0e454b126b87d4078185ae5';
    const base_url = 'https://api.openweathermap.org/data/2.5/weather?';
  
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
          throw new Error('City Not Found');
        }
      })
      .then((data) => {
        var y = data.main;
        const current_temperature = Math.round((y.temp - 273.15) * 9/5 + 32);
        const current_pressure = (y.pressure * 0.02952998057228486).toFixed(2);
        const current_humidity = y.humidity;
        const z = data.weather;
        const weather_description = z[0].description;
  
        // console.log(
        //   ' Temperature (in kelvin unit) = ' +
        //     current_temperature +
        //     '\n atmospheric pressure (in hPa unit) = ' +
        //     current_pressure +
        //     '\n humidity (in percentage) = ' +
        //     current_humidity +
        //     '\n description = ' +
        //     weather_description
        // );
        document.getElementById("Temperature").innerHTML = 'Temperature: ' + current_temperature + '&deg; F';
        document.getElementById("Pressure").innerHTML = 'Pressure: ' + current_pressure + ' Hg';
        document.getElementById("Humidity").innerHTML = 'Humidity: ' + current_humidity + '%';
        document.getElementById("weatherDescription").innerHTML = 'Current Weather Description: ' + weather_description;
      })
      .catch((error) => {
        console.log('Error:', error.message);
      });
  }
  
  getTemperature();
  
// converter function (F --> C)
// get weather condition
// add city
// get precipitation map
// air quality index
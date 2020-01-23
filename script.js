$(document).ready(() => {
  let citiesArray = JSON.parse(localStorage.getItem('citiesArray'));

  if (citiesArray === null) {
    citiesArray = ['Seattle'];
  }

  let lastCity = localStorage.getItem('lastCity');

  if (lastCity === null) {
    lastCity = 'Seattle';
  }

  const apikey = 'e5a72ff6461bc3ca58398ebb5e18bda3';

  const ktof = k => {
    return Math.floor(( k - 273.15 ) * 9 / 5 + 32);
  }

  const createButtons = () => {
    $('.btn-group-vertical').empty();
    for (let i = 0; i < citiesArray.length; i++) {
      const cityButton = $('<button>');
      cityButton.text(citiesArray[i]);
      cityButton.attr('data-city', citiesArray[i]);
      cityButton.addClass('btn btn-secondary text-white city-button');
      $('.btn-group-vertical').append(cityButton);
    }
  }

  const populateData = city => {
    const currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apikey;

    $.ajax({
      url: currentWeatherURL,
      method: 'GET'
    }).then(response => {

      // Get the date
      const d = new Date();
      const day = d.getDate();
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      const todaysDate = month + '/' + day + '/' + year;

      // Get all data needed from response
      const cityName = response.name;
      const country = response.sys.country;
      const weatherIcon = $('<img>');
      const weatherIconURL = 'https://openweathermap.org/img/w/' + response.weather[0].icon + '.png';
      const temp = $('<li>').text('Temperature: ' + ktof(response.main.temp) + ' K');
      const humidity = $('<li>').text('Humidity: ' + response.main.humidity + ' %');
      const wind = $('<li>').text('Wind Speed: ' + response.wind.speed + ' MPH');

      weatherIcon.attr('src', weatherIconURL);
      weatherIcon.attr('alt', response.weather[0].main);

      // Get UVI
      const lat = response.coord.lat;
      const lon = response.coord.lon;
      const uviURL = 'https://api.openweathermap.org/data/2.5/uvi?appid=' + apikey + '&lat=' + lat + '&lon=' + lon;

      $.ajax({
        url: uviURL,
        method: 'GET'
      }).then(response => {
        const uvi = $('<li>').text('UV Index: ' + response.value);

        // Append data elements to card
        $('#weather-title').text(cityName + ', ' + country + ' (' + todaysDate + ') ');
        $('#weather-title').append(weatherIcon);
        $('#weather-list').empty();
        $('#weather-list').append(temp, humidity, wind, uvi);
      });
    });

    const fiveDayURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apikey;

    $.ajax({
      url: fiveDayURL,
      method: 'GET'
    }).then(response => {
      $('')
      for (let i = 0; i < 5; i++) {
        const forecastIcon = $('<img>');
        const forecastIconURL = 'https://openweathermap.org/img/w/' + response.list[i].weather[0].icon + '.png';
        forecastIcon.attr('src', forecastIconURL);
        forecastIcon.attr('alt', response.list[i].weather[0].main);
        const forecastTemp = $('<p>').text('Temperature: ' + ktof(response.list[i].main.temp) + ' F');
        const forecastHumidity = $('<p>').text('Humidity: ' + response.list[i].main.humidity + ' %');
        const currentForecastCard = '#' + i;
        $(currentForecastCard).empty();
        $(currentForecastCard).append(forecastIcon, forecastTemp, forecastHumidity);
      }
    });
  }

  $('#search').on('click', event => {
    const citySearch = $('.form-control').val();
    const confirmCityURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + citySearch + '&appid=' + apikey;

    event.preventDefault();

    $.ajax({
      url: confirmCityURL,
      method: 'GET'
    }).then(response => {
      citiesArray.push(response.name);
      localStorage.setItem('citiesArray', JSON.stringify(citiesArray));
      $('.form-control').val('')
      createButtons();
    });
  });

  $('.btn-group-vertical').on('click', function(event) {
    populateData($(event.target).data('city'));
    localStorage.setItem('lastCity', $(event.target).data('city'));
  });

  $('#clear').on('click', () => {
    citiesArray = [];
    localStorage.setItem('citiesArray', JSON.stringify(citiesArray));
    createButtons();
  });

  createButtons();
  populateData(lastCity);
});
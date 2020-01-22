$(document).ready(() => {
  const cities = [];

  const apikey = 'e5a72ff6461bc3ca58398ebb5e18bda3';

  const createButtons = () => {
    for (let i = 0; i < cities.length; i++) {
      const cityButton = $('<button>');
      cityButton.text(cities[i]);
      cityButton.attr('data-city', cities[i]);
      cityButton.addClass('btn btn-secondary text-white city-button');
      $('.btn-group-vertical').append(cityButton);
    }
  }

  $('#search').on('click', event => {
    const citySearch = $('.form-control').val();
    const confirmCityURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + citySearch + '&appid=' + apikey;

    event.preventDefault();

    $.ajax({
      url: confirmCityURL,
      method: 'GET'
    }).then(response => {
      cities.push(response.name);
      $('.form-control').val('')
      $('.btn-group-vertical').empty();
      createButtons();
    });
  });

  $('.btn-group-vertical').on('click', function(event) {
    const city = $(event.target).data('city');

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
      weatherIcon.attr('src', weatherIconURL);
      weatherIcon.attr('alt', response.weather[0].main);
      const temp = $('<li>').text('Temperature: ' + response.main.temp + ' K');
      const humidity = $('<li>').text('Humidity: ' + response.main.humidity + ' %');
      const wind = $('<li>').text('Wind Speed: ' + response.wind.speed + ' MPH');

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
      console.log(response);

      for (let i = 0; i < 5; i++) {
        const forecastDate = $('<p>').text(response.list[i][7]);
        console.log(forecastDate);
        const forecastIcon = $('<img>');
        const forecastIconURL = 'https://openweathermap.org/img/w/' + response.list[i].weather[0].icon + '.png';
        forecastIcon.attr('src', forecastIconURL);
        forecastIcon.attr('alt', response.list[i].weather[0].main);
        const forecastTemp = $('<p>').text('Temperature: ' + response.list[i].main.temp + ' K');
        const forecastHumidity = $('<p>').text('Humidity: ' + response.list[i].main.humidity + ' %');

        const currentForecastCard = '#' + i;

        $(currentForecastCard).append(forecastIcon, forecastTemp, forecastHumidity);
      }
    });
  });

  createButtons();
});
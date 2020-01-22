$(document).ready(() => {
  const cities = [];

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
    event.preventDefault();
    $('.btn-group-vertical').empty();
    cities.push($('.form-control').val());
    $('.form-control').val('');
    createButtons();
  });

  $('.btn-group-vertical').on('click', function(event) {
    const city = $(event.target).data('city');

    const apikey = 'e5a72ff6461bc3ca58398ebb5e18bda3';
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apikey;

    $.ajax({
      url: url,
      method: 'GET'
    }).then((response) => {
      console.log(response);
    });
  });

  createButtons();
});
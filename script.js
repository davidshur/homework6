$(document).ready(() => {
  const cities = [];

  const createButtons = () => {
    for (let i = 0; i < cities.length; i++) {
      const cityButton = $('<button>');
      cityButton.text(cities[i]);
      cityButton.attr('data-city', cities[i]);
      cityButton.addClass('btn btn-secondary text-white');
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

  createButtons();
});
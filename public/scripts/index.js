// Creates a new element on the page
function newOption () {
  const arg = Math.ceil($('.option-list').children().length / 2 );
  if (arg < 9) {
    const $optionElement = $(
      `<label for='option${arg}' class='visuallyhidden'>Option${arg}</label>
      <input type='text' name='option${arg}' placeholder='Enter option ${arg}'>`
    )
    $('.option-list').append($optionElement);
    $(`input[name='option${arg}']`).get(0).scrollIntoView();
    $(`input[name='option${arg}']`).focus();
  }
  return
}

// Deletes appended elements
function deleteOption () {
  if (Math.floor($('.option-list').children().length / 2 ) > 2) {
    $('.option-list input:last-child').remove();
    $('.option-list label:last-child').remove();
  }
  return
}

$(document).ready(function () {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("main .wrapper section"));
    }
  });


  // Opens a new poll menu
  $('#toggle-form').on('click', function() {
    $('.new-poll').slideToggle();
    $('#toggle-form').slideUp();
  })

  $('#add-option').on('click', function(event) {
    event.preventDefault();
    newOption();
  }) 

  $('#remove-option').on('click', function(event) {
    event.preventDefault();
    deleteOption();
  }) 


});
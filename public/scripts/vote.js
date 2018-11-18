$(document).ready(function () {
  console.log('ready');

  //Creates and populates an array of option rates
  let rates = [];
  $numOptions = $('.sortable').children().length;
  for (let i = 1; i <= $numOptions; i++) {
    rates.push($numOptions - i);
  }
  const URL = window.location.protocol + "//" + window.location.host;
  const voteURL = URL + window.location.pathname + '/vote';
  const fraction = window.location.pathname.split('/');
  fraction.pop();
  const resURL = URL + fraction.join('/');

  console.log(voteURL);

  // Allows user to sort his option bu drag and drop
  $('.sortable').sortable({
    connectWith: '.connect', 
    update: function() {
        const productOrder = $(this).sortable('toArray');
        console.log('Product Order:', productOrder);

        // Updates an array of rates
        rates = productOrder.map((item, index) => {
          return productOrder.length - productOrder.indexOf(index.toString()) - 1;
        });
        console.log('Rates:', rates);
      }
  });


  // Sends an array of rates and redirects to another page
  $('#vote').on('click', function() {
    $.post(voteURL, {rates: rates}).done(
      $(location).attr("href", resURL)
    )
  })

});
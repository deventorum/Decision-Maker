// Helper function that renders sent invites
function displayMessage(data) {
  const $parent = $('.invites-status')
  const $message = $(
    `<p>${escape(data)}</p>`
  )
  if ($parent.children().length === 0 ) {
    $parent.append($(`<h3>Invited people</h3>`))
  } 
  $parent.append($message)
}

$(document).ready(function () {
  $('.invite-form').on('submit', function(event) {
    event.preventDefault();
    const $form = $(this);
    const URL = window.location.protocol + "//" + window.location.host + window.location.pathname + '/invite';
    const $info = $form.children('input').val()
    
    // Post emails to API and displays lists of sent emails
    $.ajax({
      type: 'POST',
      url: URL,
      data: $form.serialize(),
      success: function(data)
      {
        // Renders emails and clears the form
        displayMessage($info);
        $('.invite-form').children('input').val('');
      }
    });
  })
});
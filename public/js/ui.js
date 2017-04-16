var $ = require('jQuery');

//some code to get the navbar links toggling active correctly
module.exports = $(document).ready(function() {
  $('ul.nav > li').click(function() {
    $('ul.nav > li').removeClass('active');
    $(this).addClass('active');                
  });
  $('ul.nav > li > a').each(function() {
  	if($(this).attr('href') == window.location.pathname) {
		  $(this).parent().addClass('active');
  	};
  });
  $(".navbar-brand").click(function() {
    $('ul.nav > li').removeClass('active');
  });
});
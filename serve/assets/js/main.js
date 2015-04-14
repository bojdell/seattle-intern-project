window.edu_warning_given = false;

jQuery(document).ready(function ($) {
  // check for localstorage
  if (!window.localStorage) {
    // super crappy shim, only works on same page.
    window.localStorage = {
      setItem: function(key, val) {
          this[key] = val;
      },
      getItem: function(key) {
          return this[key];
      }
    };
  }

  var referrer = $.url().param('referred_by');
  if (referrer) {
    localStorage.setItem('referred_by', referrer);
  }

  $('.img-frame').hover(function(){
    $(this).find('.mouse-effect').stop().animate({'opacity':'0.6'});
    $(this).find('.extra-links').stop().animate({'top':'50%'});
  },function(){
    $(this).find('.mouse-effect').stop().animate({'opacity':'0'});
    $(this).find('.extra-links').stop().animate({'top':'-50%'});
  });

  var currentCategory = $('.t_line_view').find('.selected').data('category'),
      $postItems = $('.post-item');


  // set up sign up forms
  var firebase = new Firebase('https://internproject.firebaseio.com/email-signup');

  function formatDate(d){
    function pad(n){return n<10 ? '0'+n : n};

    return pad(d.getMonth()+1)+'/'
    + pad(d.getDate())+'/'
    + d.getFullYear()+" "
    + pad(d.getHours()) + ":"
    + pad(d.getMinutes()) + ":"
    + pad(d.getSeconds());
  };

  $('button').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var $text = $(this).parent().find('.email-signup-text'),
        $form = $(this).parent().parent(),
        email = $text.val();

    if (!isEmail(email)) {
      alert("Make sure your email address is correct.");
      return false;
    } else if (/com/.test(email)) {
      if (!window.edu_warning_given) {
        alert("Warning: make sure to sign up with a .edu to be hear about intern-only events");
        window.edu_warning_given = true;
        return false;
      }
    }

    var loc = "unknown";
    try {
      loc = geoip_city() + ", " + geoip_region_name();
    } catch (e) {
      // we don't have the city yet, so let's not record it.
    }

    firebase.push({
      email: email,
      submit_time: formatDate(new Date()),
      referrer: localStorage.getItem('referred_by'),
      location: loc
    }, function(error) {
      if (error !== null) {
        alert("ERROR: " + error);
      } else {
        $form.hide(0, function () {
          $form.parent().parent().find(".success-message").css("text-indent", 0).fadeIn("slow").delay(2E3).fadeOut("slow", function () {
            $form.fadeIn("slow");
            $text.val('');
          });
        });
      }
    });
  });
});

function isEmail(email){
    return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);
}

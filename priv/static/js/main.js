$( document ).ready(function() {
  // Set up switchery
  var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
  elems.forEach(function(elem) {
    var switchery = new Switchery(elem,
      {
        color          : '#2e507f',
        secondaryColor : '#d5dce5',
        className      : 'switchery',
        disabled       : false,
        disabledOpacity: 0.5,
        speed          : '0.3s'
      }
    );
    elem.onchange = function() {
      $elem = $(elem);
      $elem.closest('.feature--on, .feature--off').toggleClass('feature--on feature--off');
    };
  });

  // Collapse / expand feature
  $('.feature--on > .feature__teaser, .feature--off > .feature__teaser').on('click', function (event) {
    event.preventDefault();
    $(this).closest('.feature--on, .feature--off').toggleClass('is-expanded is-collapsed');
  });

  // New feature
  $('.new-feature__add').click(function (event) {
    event.preventDefault();
    var newFeature = $(this).closest('.new-feature')
    if (newFeature.is(".is-expanded, .is-collapsed")) {
      newFeature.toggleClass('is-expanded is-collapsed');
    } else {
      newFeature.addClass('is-expanded');
    }
  });
  $('.new-feature__close').click(function (event) {
    event.preventDefault();
    var newFeature = $(this).closest('.new-feature')
    newFeature.toggleClass('is-expanded is-collapsed');
  });
});
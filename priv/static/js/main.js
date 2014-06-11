// $('.js-switch').each(
//   function () {
//     var switchery = new Switchery($(this));
//   }
// );


$( document ).ready(function() {
  // Set up switchery
  var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
  elems.forEach(function(elem) {
    var switchery = new Switchery(elem,
      {
        color          : '#2e507f',
        secondaryColor : '#dfdfdf',
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
});
var iodized = {};

iodized.init = function() {
    //iodized.switchery();
}

iodized.switchery = function() {
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
};

$(document).ready(function() {
    iodized.init();

//    var mydata = {
//        "definition": null,
//        "description": "this is an awesome new feature",
//        "master_switch_state": "dynamic",
//        "title": "some_feature"
//    };
//
//    $.ajax({
//        url: '/admin/api/features',
//        contentType: 'application/json',
//        type: 'POST',
//        data: JSON.stringify(mydata)
//    });

});


var React = require("react");
var FeatureRepo = require("./feature_repo");
var FeatureBox = require("./react/feature_box.jsx");
var Switchery = require("./vendor/switchery");
var jquery = require("jquery");


var iodized = {};

iodized.init = function() {
    iodized.switchery();
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
            $elem = jquery(elem);
            $elem.closest('.feature--on, .feature--off').toggleClass('feature--on feature--off');
        };
    });
};


document.addEventListener("DOMContentLoaded", function () {
    iodized.init();
    var featureRepo = new FeatureRepo("admin/api/features");
    React.renderComponent(
        <FeatureBox featureRepo={featureRepo}/>, document.getElementById("iodized")
    );
});


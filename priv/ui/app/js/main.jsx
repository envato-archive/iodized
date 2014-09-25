var React = require("react");
var FeatureRepo = require("./feature_repo");
var FeatureBox = require("./components/feature_box.jsx");

document.addEventListener("DOMContentLoaded", function () {
    var featureRepo = new FeatureRepo("admin/api/features");
    React.renderComponent(
        <FeatureBox featureRepo={featureRepo}/>, document.getElementById("iodized")
    );
});


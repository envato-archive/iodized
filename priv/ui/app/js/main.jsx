var React = require("react");
var FeatureRepo = require("./feature_repo");
var FeatureBox = require("./components/feature_box.jsx");

document.addEventListener("DOMContentLoaded", function () {
  React.renderComponent(
    <FeatureBox/>, document.getElementById("iodized")
  );
});


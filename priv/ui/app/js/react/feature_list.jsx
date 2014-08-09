var React = require("react");
var Feature = require("./feature.jsx");

var FeatureList = React.createClass({
  render: function() {
    var self = this;
    var featureNodes = this.props.features.map(function (feature, index) {
      return (
        <Feature key={index} feature={feature} editFeature={this.props.editFeature} deleteFeature={this.props.deleteFeature} updateFeature={this.props.updateFeature}/>
      )
    }.bind(this));
    return (
      <div>{featureNodes}</div>
    );
  }
});

module.exports = FeatureList;

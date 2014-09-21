var React = require("react");
var Feature = require("./feature.jsx");

var FeatureList = React.createClass({
  propTypes: {
    features: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    updateFeature: React.PropTypes.func.isRequired,
    toggleFeature: React.PropTypes.func.isRequired,
    deleteFeature: React.PropTypes.func.isRequired
  },

  render: function() {
    var self = this;
    var featureNodes = this.props.features.map(function (feature, index) {
      return (
        <Feature key={feature.id} feature={feature} updateFeature={this.props.updateFeature} toggleFeature={this.props.toggleFeature} deleteFeature={this.props.deleteFeature} />
      )
    }.bind(this));
    return (
      <div>{featureNodes}</div>
    );
  }
});

module.exports = FeatureList;

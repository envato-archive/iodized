var React = require("react");
var Feature = require("./feature/feature.jsx");

var FeatureList = React.createClass({
  propTypes: {
    features:         React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    editingFeatures:  React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  },

  render: function() {
    var featureNodes = this.props.features.map(function (feature, index) {
      if // TODO YOU GOT TO HERE!!!
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

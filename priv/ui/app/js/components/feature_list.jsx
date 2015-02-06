var React = require("react");
var Feature = require("./feature/feature.jsx");

var FeatureList = React.createClass({
  propTypes: {
    features: React.PropTypes.shape({map: React.PropTypes.func}).isRequired
  },

  render: function() {
    var featureNodes = this.props.features.map(function (feature) {
      return (
        <Feature key={feature.id} feature={feature} />
      )
    });
    return (
      <div>{featureNodes.toArray()}</div>
    );
  }
});

module.exports = FeatureList;

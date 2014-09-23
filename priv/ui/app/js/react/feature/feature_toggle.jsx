var React = require("react/addons");

var FeatureToggle = React.createClass({
  handleToggle: function (e) {
    this.props.toggleFeature(this.props.feature, e.target.checked);
    return false;
  },
  render: function () {
    return(
        <label className={this.props.cssClass}>
          <input type="checkbox" checked={this.props.checkedState} onChange={this.handleToggle} />
          <i></i>
        </label>
        )
  }
});

module.exports = FeatureToggle;
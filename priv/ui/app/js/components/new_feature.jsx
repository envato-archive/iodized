var React = require("react");
var FeatureForm = require("./feature/form.jsx");
var Feature = require("../models/feature.js");
var jquery = require("jquery");
var FeatureViewActions = require("../actions/feature_view_actions.js");

var NewFeature = React.createClass({
  propTypes: {
    newFeature: React.PropTypes.instanceOf(Feature)
  },

  handleNewFeature: function() {
    FeatureViewActions.newFeature();
  },

  handleCancel: function() {
    FeatureViewActions.cancelEditFeature(this.props.newFeature);
  },

  visibilityClass: function() {
    if (this.props.newFeature) {
      return "is-expanded";
    } else {
      return "is-collapsed";
    }
  },

  render: function() {
    var className = "new-feature " + this.visibilityClass();
    var featureForm;
    if (this.props.newFeature) {
      featureForm = <FeatureForm feature={this.props.newFeature}/>;
    } else {
      featureForm = <div></div>;
    }

    return (
      <div className={className}>
        <button type="button" className="btn new-feature__add" onClick={this.handleNewFeature} tabIndex="0">
          <span className="glyphicon glyphicon-plus"></span>
        </button>
        <div className="new-feature__content">
          <a href="#" onClick={this.handleCancel} className="new-feature__close">
            <span className="glyphicon glyphicon-remove"></span>
          </a>
          {featureForm}
        </div>
      </div>
    );
  }
});

module.exports = NewFeature;
